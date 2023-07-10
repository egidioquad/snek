import Leaderboard from "./components/leaderboard";
import SnakeGame from "./components/snake";
import Dashboard from "./components/web3button";
import React from "react";
import { AppProvider } from './components/AppContext';


const App: React.FC = () => {
	return (
		<AppProvider>
			<div>
				<SnakeGame />
				<Dashboard />


			</div>
		</AppProvider>
	);
}
//  <Leaderboard />
export default App;
