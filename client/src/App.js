import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import PlayerPage from './pages/PlayerPage';
import LivePage from './pages/LivePage';
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (

    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        hiii
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/admin-signup" element={<SignupPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/results" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ResultsPage />
            </ProtectedRoute>
          }/>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }/>
          <Route path="/player" element={
            <ProtectedRoute allowedRoles={['player']}>
              <PlayerPage />
            </ProtectedRoute>
          }/>
          <Route path="/live" element={
            <ProtectedRoute allowedRoles={['admin', 'player']}>
              <LivePage />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
