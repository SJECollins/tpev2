import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./pages/home/HomePage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import AdCreate from "./pages/ads/AdCreate";
import AdPage from "./pages/ads/AdPage";
import AdEdit from "./pages/ads/AdEdit";
import ProfileEdit from "./pages/profiles/ProfileEdit";
import ProfilePage from "./pages/profiles/ProfilePage";
import PostCreate from "./pages/blog/PostCreate";
import PostsPage from "./pages/blog/PostsPage";
import PostEdit from "./pages/blog/PostEdit";
import PostPage from "./pages/blog/PostPage";
import AdsPage from "./pages/ads/AdsPage";
import ForumsPage from "./pages/forums/ForumsPage";
import ForumPage from "./pages/forums/ForumPage";
import DiscussionPage from "./pages/forums/DiscussionPage";
import DiscussionEdit from "./pages/forums/DiscussionEdit";
import DiscussionCreate from "./pages/forums/DiscussionCreate";
import MessageCreate from "./pages/mail/MessageCreate";
import Inbox from "./pages/mail/Inbox";
import Outbox from "./pages/mail/Outbox";
import Conversation from "./pages/mail/Conversation";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/resetpw" element={<ResetPassword />} />
        <Route exact path="/ads/create" element={<AdCreate />} />
        <Route exact path="/ads" element={<AdsPage />} />
        <Route exact path="/ad/:id/edit" element={<AdEdit />} />
        <Route exact path="/ad/:id/" element={<AdPage />} />
        <Route exact path="/profile/:id/edit" element={<ProfileEdit />} />
        <Route exact path="/profile/:id" element={<ProfilePage />} />
        <Route exact path="/blog" element={<PostsPage />} />
        <Route exact path="/post/create" element={<PostCreate />} />
        <Route exact path="/post/:id/edit" element={<PostEdit />} />
        <Route exact path="/post/:id" element={<PostPage />} />
        <Route exact path="/forums" element={<ForumsPage />} />
        <Route exact path="/forum/:id" element={<ForumPage />} />
        <Route
          exact
          path="/discussion/:id/create"
          element={<DiscussionCreate />}
        />
        <Route exact path="/discussion/:id/edit" element={<DiscussionEdit />} />
        <Route
          exact
          path="/discussion/:discussionID"
          element={<DiscussionPage />}
        />
        <Route exact path="/message/create" element={<MessageCreate />} />
        <Route exact path="/inbox" element={<Inbox />} />
        <Route exact path="/outbox" element={<Outbox />} />
        <Route exact path="/conversation/:id" element={<Conversation />} />
      </Routes>
    </div>
  );
}

export default App;
