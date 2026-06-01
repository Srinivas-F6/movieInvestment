import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import {MovieDetails} from './pages/MovieDetails';
import CreateStage from './pages/CreateStage';
import {StageDetails} from './pages/StageDetails';
import AdminDashboard from './pages/AdminDashboard';
import {Investors} from './pages/Investors';

function App() {

  return (

    <Router>

      <div className="min-h-screen bg-zinc-950 text-white">

        <Navbar />

        <main className="px-4 md:px-8 py-6">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/invest/:stageId/:movieId"
              element={<Invest />}
            />

            <Route
              path="/movie/:movieId"
              element={<MovieDetails />}
            />

            <Route
              path="/movies/:movieId/create-stage"
              element={<CreateStage />}
            />

            <Route
              path = "/movie/stageDetails/:movieId"
              element={<StageDetails />}
            />

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/movie/investorDetails/:movieId"
              element={<Investors />}
            />

          </Routes>

        </main>

      </div>

    </Router>
  );
}

export default App;