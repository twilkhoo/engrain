import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import { Card } from "../components/Card";
import type { Link as Node } from "@prisma/client";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: ID) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`;

function Home() {
  const { user } = useUser();
  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
    variables: { first: 3 },
  });

  if (!user) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: "calc(100vh - 200px)",
        }}
      >
        <div className="flex-col">
          <div className="text-4xl text-amber-950 font-comfortaa my-4">
            welcome to{" "}
          </div>
          <div className="text-amber-950 font-kalam font-black text-8xl">
            Engrain
          </div>
          <div className="text-2xl text-amber-950 font-comfortaa my-4 mb-8">
            share and save your favorite areas
          </div>
          <Link
            href="/api/auth/login"
            className="text-xl text-amber-950 font-comfortaa bg-orange-500 hover:bg-orange-600 rounded text-base my-8 p-4"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data?.links.pageInfo;

  return (
    <div
      style={{
        height: "calc(100vh - 200px)",
      }}
    >
      <Head>
        <title>Engrain</title>
        <link rel="icon" />
      </Head>
      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.links.edges.map(({ node }: { node: Node }) => (
            <Link href={`/link/${node.id}`}>
              <Card
                key={node.id}
                title={node.title}
                category={node.category}
                url={node.url}
                id={node.id}
                description={node.description}
                imageUrl={node.imageUrl}
              />
            </Link>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 font-comfortaa text-amber-950 bg-orange-500 hover:bg-orange-600 rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.links.edges = [
                    ...prevResult.links.edges,
                    ...fetchMoreResult.links.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="my-10 text-center font-medium">End.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
