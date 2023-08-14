import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

export const apiURL = import.meta.env.VITE_API_URL;

export function App() {
  const [data, setData] = React.useState<any>();

  React.useEffect(() => {
    console.log('Last deploy date:', LAST_DEPLOY_DATE);

    //create a controller
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(`${apiURL}/issues`, {
          // connect the controller with the fetch request
          signal: controller.signal,
        });
        // handle success
        setData(await response.json());
      } catch (e) {
        // Handle the error
      }
    })();
    //aborts the request when the component umounts
    return () => controller?.abort();
  }, []);

  return (
    <div>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}

      <p>{JSON.stringify(data) || 'loading data...'}</p>
    </div>
  );
}

export default App;
