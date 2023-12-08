// import withRouter from './withRouter';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  // Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import ListOfBooks from "./components/ListOfBooks";
import SearchResult from "./pages/SearchResult";

import { AuthProvider } from "./context/AuthContext";
// import { MessageProvider } from "./context/MessageContext";
// import GlobalMessage from "./utils/GlobalMessage";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BookListPage from "./pages/Booklist";
import OrderHistory from "./pages/OrderHistory";
import AdminPage from "./pages/AdminPage";
import PublicList from "./components/PublicList";
import AddReview from "./components/AddReview";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    }
  }
});

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: "/list",
        element: <ListOfBooks></ListOfBooks>
      },
      {
        path: "/searchresult",
        element: < SearchResult ></SearchResult >
      },
      {
        path: "/booklist",
        element: <BookListPage></BookListPage>
      },
      {
        path: "/orderhistory",
        element: <OrderHistory />
      },
      {
        path: "/adminpage",
        element: <AdminPage />
      },
      {
        path: "/publiclist",
        element: <PublicList />
      },
      {
        path: "/addreview",
        element: <AddReview />
      },
    ]
  },
]);

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthProvider>
        <div>
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}



export default App;
