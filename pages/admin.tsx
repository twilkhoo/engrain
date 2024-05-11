import React, { useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import type { GetServerSideProps } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Places from "../components/Map";

type FormValues = {
  title: string;
  url: string;
  category: string;
  description: string;
  image: FileList;
};

const CreateLinkMutation = gql`
  mutation (
    $title: String!
    $url: String!
    $imageUrl: String!
    $category: String!
    $description: String!
  ) {
    createLink(
      title: $title
      url: $url
      imageUrl: $imageUrl
      category: $category
      description: $description
    ) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;

// const PlacesAutocomplete = ({ setSelected }) => {
//   const {
//     ready,
//     value,
//     setValue,
//     suggestions: { status, data },
//     clearSuggestions,
//   } = usePlacesAutocomplete();

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     const results = await getGeocode({ address });
//     const { lat, lng } = await getLatLng(results[0]);
//     setSelected({ lat, lng });
//   };

//   return (
//     <Combobox onSelect={handleSelect}>
//       <ComboboxInput
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         disabled={!ready}
//         className="combobox-input"
//         placeholder="Search an address"
//       />
//       <ComboboxPopover>
//         <ComboboxList>
//           {status === "OK" &&
//             data.map(({ place_id, description }) => (
//               <ComboboxOption key={place_id} value={description} />
//             ))}
//         </ComboboxList>
//       </ComboboxPopover>
//     </Combobox>
//   );
// };

const Admin = () => {
  // const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_KEY!,
  //   libraries: ["places"],
  // });

  const [createLink, { data, loading, error }] =
    useMutation(CreateLinkMutation);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return;
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const data = await res.json();
    const formData = new FormData();

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    toast.promise(
      fetch(data.url, {
        method: "POST",
        body: formData,
      }),
      {
        loading: "Uploading...",
        success: "Image uploaded.",
        error: `Upload failed: ${error}`,
      }
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { title, url, category, description, image } = data;
    const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${image[0]?.name}`;
    const variables = { title, url, category, description, imageUrl };
    try {
      toast.promise(createLink({ variables }), {
        loading: "Creating new memory..",
        success: "Memory created.",
        error: `Error: ${error}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12 font-comfortaa">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">New memory.</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg bg-orange-500"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            {...register("title", { required: true })}
            name="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <input
            placeholder="Description"
            {...register("description", { required: true })}
            name="description"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Url</span>
          <input
            placeholder="https://example.com"
            {...register("url", { required: true })}
            name="url"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            placeholder="Name"
            {...register("category", { required: true })}
            name="category"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Upload an image.</span>
          <input
            {...register("image", { required: true })}
            onChange={uploadPhoto}
            type="file"
            accept="image/png, image/jpeg"
            name="image"
          />
        </label>
        <Places />
        <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_KEY!}>
          <div style={{ width: "100%", height: "400px" }}>
            <Map zoom={10} center={{ lat: 53.54, lng: 10 }} />
          </div>
        </APIProvider>

        <button
          disabled={loading}
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              Creating...
            </span>
          ) : (
            <span>Create Link</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Admin;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/login",
      },
      props: {},
    };
  }

  const user = await prisma.user.findUnique({
    select: {
      email: true,
      role: true,
    },
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
