const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let forest = [];

function colorNameToHex(color) {
  const colorMap = {
    red: '#FF0000',
    green: '#008000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    white: '#FFFFFF',
    black: '#000000'
  };

  return colorMap[color.toLowerCase()];
}

function createAsciiTree(color) {
  const treeTop = color === 'white' ? 'O' : '*';
  return {
    color: color,
    tree: `
  ${treeTop}  
 /|\\ 
  |  
`
  };
}

app.post('/arrivals', (req, res) => {
  const color = req.body.color;

  if (!color) {
    res.status(400).json({ error: 'Invalid input. Please provide a color.' });
  } else {
    const hexColor = colorNameToHex(color);
    if (hexColor) {
      const newTree = createAsciiTree(color);
      forest.push(newTree);
      const currentTime = new Date().toISOString();
      console.log(`Received color: ${hexColor} at ${currentTime}. Added a new ${color} tree to the forest.`);
      res.status(200).json({ message: `Color received at ${currentTime}.`, color: hexColor, tree: newTree.tree });
    } else {
      res.status(400).json({ error: `Invalid color name: ${color}. Please provide a basic color name.` });
    }
  }
});

app.get('/forest', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
