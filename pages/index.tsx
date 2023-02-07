import Head from "next/head";
import Image from "next/image";
import { gql, useQuery } from "@apollo/client";
import { AwesomeLink } from "@/components/AwesomeLink";

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      edges {
        cursor
        node {
          category
          description
          id
          imageUrl
          url
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
interface Data {
  links: {
    edges: Edge[];
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
  };
}

interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface Edge {
  cursor: string;
  node: Link;
}

export default function Home() {
  const { error, loading, fetchMore } = useQuery(AllLinksQuery, {
    variables: {
      first: 2,
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error {error.message} </p>;

  const { endCursor, hasNextPage } = data.links.pageInfo;
  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.links.edges.map(({ node }: Edge) => {
            const { category, description, id, imageUrl, title, url }: Link =
              node;
            return (
              <AwesomeLink
                key={id}
                category={category}
                description={description}
                id={id}
                imageUrl={imageUrl}
                title={title}
                url={url}
              />
            );
          })}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: {
                  after: endCursor,
                },
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
            More
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You have reached the end!
          </p>
        )}
      </div>
    </div>
  );
}
