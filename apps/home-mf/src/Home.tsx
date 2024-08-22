import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.scss'

interface Tag {
  sys: {
    id: string;
  };
}

interface Metadata {
  tags: Tag[];
}

interface HeroContent {
  content: {
    content: { value: string }[];
  }[];
}

interface HomepageFields {
  heroImg: string;
  heroDescription: HeroContent;
}

interface Homepage {
  metadata: Metadata;
  fields: HomepageFields;
}

export default () => {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const res = await axios.get<Homepage[]>('https://content-service-three.vercel.app/api/content');
        const content = res.data;
        console.log(content)

        const homepageData = content.find((type: { metadata: { tags: { sys: { id: string; }; }[]; }; }) =>
          type.metadata.tags.some((tag: { sys: { id: string; }; }) => tag.sys.id === 'homepage')
        );

        setHomepage(homepageData || null);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Homepage content not found.');
      }
    };

    fetchHomepageData();
  }, []);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!homepage) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const homepageDescription = homepage.fields.heroDescription.content[0].content[0].value;

  return (
    <div>
      <div 
      className="flex flex-col items-center p-4 space-y-6"
      >
        {homepage.fields.heroImg && (
          <img
            src={homepage.fields.heroImg}
            alt="hero-image"
            className="w-full h-[35vh] md:h-[50vh] lg:h-[60vh] object-cover"
            />
        )}
        {homepage.fields.heroDescription && (
          <p className="text-center text-lg text-grey-700 break-words">{homepageDescription}</p>
        )}
      </div>
    </div>
  );
};
