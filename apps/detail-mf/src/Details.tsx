import React, { useEffect, useState } from 'react';

interface RoverReferenceFields {
  name?: string;
  status?: string;
  landDate?: string;
  launchDate?: string;
  maxDate?: string;
  totalPhotos?: number;
}

interface PostFields {
  imgSrc?: string;
  name?: string;
  earthDate?: string;
  roverReference?: {
    fields: RoverReferenceFields;
  };
}

interface Post {
  fields: PostFields;
}

export default ({ params }: { params: { id: string } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('https://content-service-three.vercel.app/api/content', {
          cache: 'no-store'
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response structure');
        }

        const post = data.find((item: any) => item.sys.id === params.id);

        if (!post) {
          throw new Error('Post not found');
        }

        setPost(post);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const roverReference = post?.fields?.roverReference?.fields;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {post?.fields.imgSrc && (
          <div className="col-span-1">
            <img
              src={post.fields.imgSrc}
              alt={post.fields.name || 'Image'}
              className="w-full h-auto object-cover rounded-lg shadow-md border border-gray-200"
            />
          </div>
        )}
        <div className="col-span-1 space-y-4">
          {roverReference?.name && (
            <h1 className="text-3xl font-bold text-blue-400"><span className="text-gray-900">Rover:</span> {roverReference.name}</h1>
          )}
          {roverReference?.status && (
            <p className="text-lg text-green-400"><strong className="text-gray-900">Status:</strong> {roverReference.status}</p>
          )}
          {post?.fields.earthDate && (
            <p className="text-lg text-gray-700"><strong className="text-gray-900">Image Captured:</strong> {post.fields.earthDate}</p>
          )}
          {roverReference?.landDate && (
            <p className="text-lg text-gray-700"><strong className="text-gray-900">Land Date:</strong> {roverReference.landDate}</p>
          )}
          {roverReference?.launchDate && (
            <p className="text-lg text-gray-700"><strong className="text-gray-900">Launch Date:</strong> {roverReference.launchDate}</p>
          )}
          {roverReference?.maxDate && (
            <p className="text-lg text-gray-700"><strong className="text-gray-900">Max Date:</strong> {roverReference.maxDate}</p>
          )}
          {roverReference?.totalPhotos !== undefined && (
            <p className="text-lg text-gray-700"><strong className="text-gray-900">Total Photos:</strong> {roverReference.totalPhotos}</p>
          )}
        </div>
      </div>
    </div>
  );
};
