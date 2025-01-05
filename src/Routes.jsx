
import Login from './pages/Login/Login';
import Orders from './pages/Orders/Orders'
import Ticket from './pages/Ticket/Ticket'
import Notfound from './pages/PageNotFound/Notfound';
import Home from './pages/Home/Home';
import Chat from './pages/chat/Chat';

let routes = [
    { path: "/", element: <Home /> },
    { path: "/chat", element: <Chat /> },
    { path: "/login", element: <Login /> },
    { path: "/orders/:id", element: <Orders /> },
    { path: "/ticket", element: <Ticket /> },
    { path: "*", element: <Notfound /> }
]

export default routes