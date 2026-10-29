import { Route, Routes } from "react-router-dom";
import "./App.css";
import GridList from "./features/dragAndDropList/pages/GridList";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlaylistDnD from "./pages/Playlist";
import PlaylistPage from "./features/InfiniteScrollwithVirtualization/pages/PlaylistDnd";
import TodoListPage from "./features/InfiniteScrollwithVirtualization/pages/ToDoListPage";
import UserAvatar from "./features/Image/page/UserAvatar";
import SmartImageShowcasePage from "./features/Image/page/SmartImageShowcasePage";
import PortalLayerShowcasePage from "./features/PortalLayerManager/pages/PortalLayerShowcasePage";
import DropdownShowcasePage from "./features/dropdown/pages/DropdownShowcasePage";
import DebounceDemoPage from "./features/Debounce/pages/DebounceDemoPage";
import ScrollMotionDemoPage from "./features/scrollMotion/pages/ScrollMotionDemoPage";
import SmartRenderBoundaryDemoPage from "./features/smartRender/pages/SmartRenderBoundaryDemoPage";

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={
          <div className="w-full h-screen bg-gray-50 overflow-hidden">
            <h1 className="text-xl font-bold p-4">
              Reusable Virtual Grid Demo
            </h1>
            <div className="flex h-full">
              <div className="flex-1 overflow-hidden mb-20">
                <GridList />
              </div>
            </div>
          </div>
        } />
        <Route path="/dnd" element={<PlaylistDnD/>} />
        <Route path="/custom" element={<PlaylistPage/>} />
        <Route path="/todo" element={<TodoListPage/>} />
        <Route path="/avatar" element={<UserAvatar/>} />
        <Route path="/images" element={<SmartImageShowcasePage/>} />
        <Route path="/layer-manager" element={<PortalLayerShowcasePage/>} />
        <Route path="/dropdowns" element={<DropdownShowcasePage/>} />
        <Route path="/debounce" element={<DebounceDemoPage/>} />
        <Route path="/scroll" element={<ScrollMotionDemoPage/>} />
        <Route path="/render" element={<SmartRenderBoundaryDemoPage/>} />
      </Routes>

    </QueryClientProvider>
  );
}

export default App;