import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import AdMini from "../ads/AdMini";
import PostShort from "../blog/PostShort";

const HomePage = () => {
  const [ads, setAds] = useState({ results: [] });
  const [blogs, setBlogs] = useState({ results: [] });
  const [discussions, setDiscussions] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: ads }, { data: blogs }, { data: discussions }] =
          await Promise.all([
            axiosReq.get("/ads/?limit=4"),
            axiosReq.get("/blog/?limit=4"),
            axiosReq.get("/discussions/?limit=6"),
          ]);
        setAds(ads);
        setBlogs(blogs);
        setDiscussions(discussions);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, []);

  return (
    <div className="w-4/5 mx-auto">
      <div className="w-full">
        <div className="flex flex-row w-full justify-center">
          <p className="VertText my-4">Welcome To</p>
          <h1 className="tracking-widest text-4xl">
            The <br />
            Plant <br /> Exchange
          </h1>
        </div>
        <div className="flex flex-row flex-wrap w-full mx-4">
          <div className="flex flex-col lg:w-2/3">
            <div className="mb-4 flex flex-col border-t-2">
              <h3>Latest ads on the exchange: </h3>
              <div className="flex flex-row flex-wrap justify-center">
                {ads.results?.length ? (
                  ads.results.map((ad) => <AdMini key={ad.id} {...ad} />)
                ) : (
                  <p>No ads found.</p>
                )}
              </div>
              <p>
                Visit the{" "}
                <Link to="/ads" className="inline-links">
                  exchange
                </Link>{" "}
                to view more!
              </p>
            </div>
            <div className="flex flex-col border-y-2">
              <h3>Latest blog posts: </h3>
              <div className="flex flex-row flex-wrap justify-center">
                {blogs.results?.length ? (
                  blogs.results.map((post) => (
                    <PostShort key={post.id} {...post} />
                  ))
                ) : (
                  <p>No blog posts found.</p>
                )}
              </div>
              <p>
                Visit the{" "}
                <Link to="/blog" className="inline-links">
                  blog
                </Link>{" "}
                to view more!
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3 lg:border-y-2 lg:border-s-2 p-2">
            <h4>Latest discussions: </h4>
            <ul>
              {discussions.results?.length ? (
                discussions.results.map((discussion) => (
                  <li key={discussion.id} className="list-disc ms-4 py-2">
                    <Link
                      to={`/discussion/${discussion.id}`}
                      className="inline-links"
                    >
                      {discussion.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No discussions found.</li>
              )}
            </ul>
            <p>
              Visit the{" "}
              <Link to="/forums" className="inline-links">
                forums
              </Link>{" "}
              to view more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
