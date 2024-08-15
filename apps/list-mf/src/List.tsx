import React, { useEffect, useRef, useState } from 'react';
import PaginationComponent from './components/pagination';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.scss";
import detailsWrapper from "details/detailsWrapper";
interface Post {
  sys: {
    id: string;
  };
  fields: {
    imgSrc: string;
    earthDate: string;
    roverReference: {
      fields: {
        name: string;
        maxDate: string;
      }
    }
  };
}

const fetchPosts = async () => {
  try {
    const res = await fetch('https://content-service-three.vercel.app/api/content', {
      cache: 'no-store'
    });
    const data = await res.json();
    const posts = data.filter((type: any) =>
      type.metadata.tags.some((tag: any) => tag.sys.id === "posts")
    );
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

export default () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  const loadPosts = async (page: number) => {
    const fetchedPosts = await fetchPosts();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const filteredPosts = fetchedPosts.slice(startIndex, endIndex);
    setPosts(filteredPosts);
    setTotalPages(Math.ceil(fetchedPosts.length / pageSize));
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const Details = (params: any) => {
    const divRef = useRef(null);

    useEffect(() => {
      detailsWrapper(divRef.current, params);
    }, [params]);
    return (
      <div ref={divRef}></div>
    );
  };

  return (
    <React.Fragment>
      <h1 className="text-center text-3xl md:text-2xl lg:text-2xl font-bold mb-6">
        Curiosity Rover Images
      </h1>
      <div className="flex flex-wrap justify-center">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.sys.id}
              className="bg-gray-100 rounded-lg shadow-md p-4 m-4 max-w-sm w-full"
            >
              {post.fields.imgSrc ? (
                <img
                  src={post.fields.imgSrc}
                  alt={post.fields.roverReference.fields.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4"></div>
              )}
              <h2 className="text-xl font-semibold mb-2">
                {post.fields.roverReference.fields.name || 'Unknown Rover'}
              </h2>
              {post.fields.earthDate ? (
                <p className="text-gray-600 mb-4">
                  {post.fields.earthDate}
                </p>
              ) : (
                <p className="text-gray-600 mb-4">Date not available</p>
              )}
              {post.sys.id &&
                // className="text-blue-500 hover:text-blue-700 font-medium"
                <Router>
                  <div>
                    <nav>
                      <ul>
                        <li>
                          <Link to={`/details/${post.sys.id}`} className="text-blue-500 hover:text-blue-700 font-medium">Details</Link>
                        </li>
                      </ul>
                    </nav>

                    <div className="flex-1 overflow-hidden p-4">
                      <Routes>
                        <Route path="/details/:id" element={<Details params={post.sys.id} />} />
                      </Routes>
                    </div>
                  </div>
                </Router>
              }
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No posts available.</p>
        )}
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </React.Fragment>
  );
};

