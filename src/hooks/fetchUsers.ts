import { useState, useEffect } from 'react'

function deepValue(obj: any, path: string) {
  for (var i = 0, pathArr = path.split('.'), len = pathArr.length; i < len; i++) {
    obj = obj[pathArr[i]];
  };
  return obj;
};

/**
 * @param string url
 * @param path string Perod separated value that references a path of the result value.
 */
export function useFetchUsers<TUser>(url: string, path: string): [typeof currentUser, typeof next, typeof previous, typeof loading] {
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [userList, setUserList] = useState<TUser[]>([]);
  const [currentUser, setCurrentUser] = useState<TUser | undefined>();
  const [userIndex, setUserIndex] = useState<number | undefined>();
  const [next, setNext] = useState<() => void | undefined>();
  const [previous, setPrevious] = useState<() => void | undefined>();

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchUsers()
    }
  }, [mounted])

  useEffect(() => {
    if (userIndex === undefined) return;
    setCurrentUser(userList[userIndex]);
  }, [userIndex])

  const fetchUsers = () => {
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        if (deepValue(res, path).length !== undefined) {
          setUserList([...userList, ...res.results])
          setUserIndex((userIndex !== undefined ? userIndex + 1 : 0))
        }
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!loading) {
      setNext(() => () => {
        // if we are at the end of the userList
        // then we can fetchUsers from the api
        if (userIndex === userList.length - 1) {
          fetchUsers();
        }
        // if not we can simply go to the next index
        // of the userList array that we have in memory
        else if (userIndex !== undefined) {
          setUserIndex(userIndex + 1);
        }
      });
    }
    else {
      setNext(undefined);
    }
  }, [loading, userIndex]);

  useEffect(() => {
    // if we are NOT at the beginning of the array then
    // we can go to the previous item in the userList
    if (userIndex !== undefined && userIndex > 0) {
      setPrevious(() => () => {
        setUserIndex(userIndex - 1);
      });
    }
    // if not we are going to disable the action
    else {
      setPrevious(undefined);
    }
  }, [userIndex]);

  return [currentUser, next, previous, loading];
};
