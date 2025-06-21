// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import PostProject from './pages/PostProject';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import MyContracts from './pages/MyContracts';
import ProjectBids from './pages/ProjectBids';

function App() {
    return (
        <div className="app-container"> {/* New overall container class */}
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                <Route element={<ProtectedRoute allowedRoles={['client']} />}>
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/post-project" element={<PostProject />} />
                    <Route path="/projects/:id/bids" element={<ProjectBids />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
                    <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['client', 'freelancer']} />}>
                    <Route path="/my-contracts" element={<MyContracts />} />
                </Route>

                <Route path="*" element={<div className="flex-center error-message">404 - Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;