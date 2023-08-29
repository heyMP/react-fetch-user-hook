import { useFetchUsers } from './hooks/fetchUsers';
import { User } from './types/UserAPI';
import './App.css'

function App() {
  const [user, next, previous] = useFetchUsers<User>('https://randomuser.me/api/', 'results');

  return (
    <>
      <div className='user-display'>
        <img key={user?.picture.thumbnail} className="thumbnail" src={user?.picture.thumbnail} />
        <div>{user?.name.first}</div>
      </div>

      <button onClick={previous} disabled={!previous}>previous</button>
      <button onClick={next} disabled={!next}>{next ? 'Next' : '...'}</button>
    </>
  )
}

export default App
