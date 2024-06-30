import './style.css';

import { h } from 'preact';
import { useState } from 'preact/hooks';
import Grid from './grid';
import Number from './number';

const App = () =>
{
	const [grid, setGrid] = useState(
		Array.from(
			{ length: 7 },
			() => Array.from(
				{ length: 5 },
				() => false,
			),
		),
	);
	return h(
		"div",
		{ className: "app" },
		h(
			"h1",
			null,
			"Numeric door puzzle"),
		h(
			"div",
			{ className: "content" },
			h(
				Grid,
				{
					grid: grid,
					callback: setGrid,
				},
			),
			h(
				Number,
				{ grid: grid },
			)
		),
	);
};

export default App;
