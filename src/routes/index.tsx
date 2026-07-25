import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import Home from '../pages/Home';
import Articles from '../pages/Articles';
import ArticleDetail from '../pages/ArticleDetail';
import Videos from '../pages/Videos';
import VideoDetail from '../pages/VideoDetail';
import About from '../pages/About';

const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles', element: <Articles /> },
      { path: 'articles/:slug', element: <ArticleDetail /> },
      { path: 'videos', element: <Videos /> },
      { path: 'videos/:slug', element: <VideoDetail /> },
      { path: 'about', element: <About /> },
    ],
  },
], { basename });
