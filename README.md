🪶 FeatherTasks
a cozy little productivity app for people who actually want to get stuff done.

What is this

FeatherTasks is a full-stack study companion. log your sessions, stay on track with a pomodoro timer, manage your todos, and watch your streak grow day by day. that's it. no noise.
built with the MERN stack and deployed on Vercel + Render with MongoDB Atlas.

# Features

🍅 pomodoro timer

25 minutes of focus, then breathe. short breaks, long breaks, alarm sounds, the whole deal. your attention span will thank you (especially for my adhd gang).

✅ todo list

add, edit, delete, reorder, favourite, and check off your tasks. 

📓 study log

log what you studied, how long, and any notes. filter by today, last 7 days, or last 30 days. stats dashboard shows total hours, sessions, daily average, and today's hours at a glance.

🔥 streak tracking

study every day, keep the streak alive. miss a day and it resets — no mercy, but also no judgment.

🔐 auth

JWT-based signup and login. your data is yours, behind a token, not floating around.


tech stack
layertechfrontendReact + VitestylingTailwind CSSbackendNode.js + ExpressdatabaseMongoDB Atlas + MongooseauthJWTdeploymentVercel (frontend) · Render (backend)

running it locally

bash# clone it

git clone https://github.com/yourusername/feathertasks.git

cd feathertasks

# backend

cd backend

npm install

create a .env file (see below)

npm run dev

# frontend (new terminal)

cd frontend

npm install

npm run dev

backend .env

PORT=5000

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=something_secret

frontend .env

VITE_API_URL=http://localhost:5000


deployment

frontend lives on Vercel — just connect your repo and set VITE_API_URL to your Render backend URL

backend lives on Render — set the environment variables in the Render dashboard

database on MongoDB Atlas — whitelist 0.0.0.0/0 in network access so Render can connect


Project Structure


# Frontend
- `src/components/` — Navbar, FallingFeathers, etc.
- `src/pages/` — Home, Login, Todos, Pomodoro, Log
- `src/assets/` — logo, sounds
- `vite.config.js`

# Backend
- `controllers/` — todo + studylog logic
- `middleware/` — auth (JWT)
- `models/` — User, Todo, StudyLog
- `routes/` — API endpoints
- `server.js` — entry point
  
<img width="1893" height="865" alt="image" src="https://github.com/user-attachments/assets/5b27cb6f-3b40-476d-aad4-185f82469023" />


<img width="1915" height="865" alt="image" src="https://github.com/user-attachments/assets/75a0ed72-c5ed-4d88-8059-864c7de2b054" />


<img width="1897" height="862" alt="image" src="https://github.com/user-attachments/assets/b1b2e44c-943f-4cc9-855e-2ff2bfb97fe3" />

made by

Nedal Fazli — built this to actually use it, not just to add to a portfolio. though it ended up in the portfolio anyway.

feathers are light. so is the app.
