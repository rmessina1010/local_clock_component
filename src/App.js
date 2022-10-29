import logo from './logo.svg';
import './App.css';
import ClockWrap from './components/clockWrap';
import {Clock} from './components/clockFunctional';
import {Secs, NewClock, ClockFace1} from './components/timefaces';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ClockWrap />
        <NewClock depth={0} face={ClockFace1}/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
