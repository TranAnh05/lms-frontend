import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from './routes';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right" 
        autoClose={2000} // Giảm xuống 2s cho mượt mà
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false} // Tắt cái này để tránh giữ trạng thái khi chuyển tab/trang
        draggable
        pauseOnHover
        theme="light"
        limit={3} 
      />
    </>
  );
}

export default App;