const fetch = require('node-fetch');
const contentfulManagement = require('contentful-management');
require('dotenv').config();

const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
});

const fetchFromNasaApi = async () => {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${process.env.NASA_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`NASA API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.photos.slice(0, 30);
};

const populateContentful = async () => {
    try {
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID);

        const roverEntries = await environment.getEntries({
            content_type: 'rover',
            'fields.name': 'Curiosity',
            limit: 1
        });

        if (roverEntries.items.length === 0) {
            throw new Error('No existing rover entry found.');
        }

        const roverEntryId = roverEntries.items[0].sys.id;
        const photos = await fetchFromNasaApi();

        const processedImgSrcs = new Set();

        for (const photo of photos) {
            if (processedImgSrcs.has(photo.img_src)) {
                continue;
            }

            processedImgSrcs.add(photo.img_src);

            const entryData = {
                fields: {
                    imgSrc: {
                        'en-US': photo.img_src
                    },
                    earthDate: {
                        'en-US': photo.earth_date
                    },
                    roverReference: {
                        'en-US': {
                            sys: {
                                id: roverEntryId,
                                linkType: 'Entry',
                                type: 'Link'
                            }
                        }
                    },
                },
                metadata: {
                    tags: [
                        { sys: { id: 'posts', linkType: 'Tag', type: 'Link' } }
                    ]
                }
            };

            const existingEntries = await environment.getEntries({
                content_type: 'post',
                'fields.imgSrc': photo.img_src,
                limit: 1
            });
          
            if (existingEntries.items.length > 0) {
                const entryId = existingEntries.items[0].sys.id;
                const existingEntry = await environment.getEntry(entryId);
                Object.assign(existingEntry.fields, entryData.fields);
                const updatedEntry = await existingEntry.update();
                await updatedEntry.publish();
                console.log(`Updated and published entry with id ${entryId}`);
            } else {
                const newEntry = await environment.createEntry('post', entryData);
                const publishedEntry = await newEntry.publish();
                console.log(`Created and published new entry with id ${publishedEntry.sys.id}`);
            }
        }

        console.log('Contentful has been populated and published successfully!');
    } catch (error) {
        console.error('Error populating Contentful:', error);
    }
};

populateContentful();
