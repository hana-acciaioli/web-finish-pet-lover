const SUPABASE_URL = 'https://xflvvifvtiottijjafxv.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHZ2aWZ2dGlvdHRpamphZnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQyOTQ3NTIsImV4cCI6MTk3OTg3MDc1Mn0.idta3hjAHwlVQERgKkABojh4PQz1XKeehESdU7w1QJ8';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

// > Part B: Export async function that
export async function createPet(pet) {
    return await client.from('pets').insert(pet).single();
}
//      - inserts (creates) a supplied pet argument into supabase
//      - returns a single data object (not an array)

// > Part C: Export async function that
export async function getPets(pets) {
    return await client.from('pets').select('*').order('created_at').limit(100);
}
//      - gets all pets from supabase
//      - order the list by created date

/* Storage Functions */

export async function uploadImage(bucketName, imagePath, imageFile) {
    // we can use the storage bucket to upload the image,
    // then use it to get the public URL
    const bucket = client.storage.from(bucketName);

    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // in this case, we will _replace_ any
        // existing file with same name.
        upsert: true,
    });

    if (response.error) {
        // eslint-disable-next-line no-console
        console.log(response.error);
        return null;
    }

    // Construct the URL to this image:
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    // URL Looks like:
    // https://nwxkvnsiwauieanvbiri.supabase.co/storage/v1/object/public/images/pets/984829079656/Franky.jpeg

    return url;
}
