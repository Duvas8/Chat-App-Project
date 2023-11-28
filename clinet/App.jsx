import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashbord from './components/Dashbord';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import './App.css'



function App() {

  return (
    <main className='App'>
  
    <Routes>
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/nauthorized' element={<Unauthorized/>}/>

      <Route  element={<RequireAuth allowedRoles={[2001]}/>} >
        <Route path='/dashbord' element={<Dashbord />}/>
      </Route>
    </Routes>
    
      
      
      
    </main>
  )
}

export default App
