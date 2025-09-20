import Head from "next/head";

import { mockBack } from "../public/scripts/mockBack";

import { IndexLayout } from "../components/IndexLayout";
import { BoardItem } from "../components/BoardItem";

export default function Index() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard page" />
        <link rel="shortcut icon" href="/img/dashboardIcon.png" />
        <link rel="apple-touch-icon" href="/img/dashboardIcon.png" />
      </Head>
      <IndexLayout
        boardItems={mockBack.map((server) => (
          <BoardItem {...server} key={server.id} />
        ))}
      />
    </>
  );
}
