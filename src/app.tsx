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
			() => [false, false, true, false, false],
		),
	);
	return h(
		"div",
		{ className: "app" },
		h(
			"div",
			{ className: "content" },
			h(
				"div",
				null,
				h(
					"h1",
					{ style: "margin-bottom: 0px;" },
					"Pattern helper",
				),
				h(
					"p",
					{ style: "margin-top: 0px;" },
					'for The Last Case of Benedict Fox',
				),
			),
			h(
				Number,
				{ grid: grid, setGrid: setGrid },
			),
			h(
				Grid,
				{
					grid: grid,
					callback: setGrid,
				},
			),
		),
	);
};

export default App;
