const express = require('express');
const bodyParser = require('body-parser');
const projectsRouter = require('./projects');


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Sample initial data
const projects = [];
let issueIdCounter = 1;

// Home Page
app.get('/', (req, res) => {
    res.render('home', { projects });
});

// Create Project Page
app.get('/create', (req, res) => {
    res.render('createProject');
});

app.post('/projects', (req, res) => {
    const { name, description, author } = req.body;
    const project = { id: projects.length + 1, name, description, author };
    projects.push(project);
    res.redirect('/');
});

// Project Detail Page
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.send('Project not found.');
    }

    const { labels, author, search } = req.body;
    let issues = []; // Fill this with filtered/sorted issues based on labels, author, and search

    res.render('projectDetail', { project, issues });
});

// Create Issue Page
app.get('/projects/:id/create-issue', (req, res) => {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.send('Project not found.');
    }
    res.render('createIssue', { project });
});

app.post('/projects/:id/issues', (req, res) => {
    const { id } = req.params;
    const { title, description, labels, author } = req.body;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.send('Project not found.');
    }

    const issue = {
        id: issueIdCounter++,
        title,
        description,
        labels: labels ? labels.split(',').map(label => label.trim()) : [],
        author,
    };
    // Store the issue in your data storage or database
    // For simplicity, we'll just log the issue to the console
    console.log('Created Issue:', issue);

    res.redirect(`/projects/${id}`);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
