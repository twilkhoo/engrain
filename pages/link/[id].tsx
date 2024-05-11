import React from "react";
import prisma from "../../lib/prisma";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

const BookmarkLinkMutation = gql`
  mutation ($id: ID!) {
    bookmarkLink(id: $id) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;

const Link = ({
  link,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createBookmark] = useMutation(BookmarkLinkMutation);

  const bookmark = async () => {
    setIsLoading(true);
    toast.promise(createBookmark({ variables: { id: link.id } }), {
      loading: "Saving...",
      success: "Saved.",
      error: "Error.",
    });
    setIsLoading(false);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 200px)",
      }}
    >
      <div className="prose container mx-auto px-8 font-comfortaa">
        <Toaster />
        <button
          onClick={() => bookmark()}
          className="my-4 text-amber-950 font-medium py-2 px-4 rounded-md hover:bg-orange-600 bg-orange-500"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">Saving...</span>
          ) : (
            <span>Save</span>
          )}
        </button>
        <h1>{link.title}</h1>
        <img src={link.imageUrl} className="shadow-lg rounded-lg" />
        <p>{link.category}</p>
        <p>{link.description}</p>
        {/* <a className="text-orange-700" href={`${link.url}`}>
          {link.url}
        </a> */}
      </div>
    </div>
  );
};

export default Link;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const link = await prisma.link.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      title: true,
      category: true,
      url: true,
      imageUrl: true,
      description: true,
    },
  });

  if (!link)
    return {
      notFound: true,
    };

  return {
    props: {
      link,
    },
  };
};
