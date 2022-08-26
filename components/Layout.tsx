import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Layout.module.css";
import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
}
const Layout: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter()
  const { search } = router.query
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChangeSearchTerm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const onSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(searchTerm && searchTerm!=""){
      router.push(`/cars/${searchTerm}`)
    }
  };

  useEffect(()=>{
    setSearchTerm(typeof search == "string" ? search : "")
  }, [search])

  return (
    <>
      <Head>
        <title>Cars</title>
        <meta name="description" content="Cars shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Head bar */}
      <div className={styles.head}>
        <div className={styles.headSide}>
          <Link href="/not_ready" className={styles.headItem}>
            <a>Offer wone Top Deqls 1 Discount</a>
          </Link>
        </div>
        <div className={styles.headSide}>
          <Link href="/not_ready">
            <a className={`${styles.headItem} ${styles.headItemBorder}`}>
              select location
            </a>
          </Link>
          <Link href="/not_ready">
            <a className={`${styles.headItem} ${styles.headItemBorder}`}>
              track order
            </a>
          </Link>
          <Link href="tel:0012345678">
            <a className={`${styles.headItem} ${styles.headItemBorder}`}>
              001 234 5678
            </a>
          </Link>
          <Link href="/not_ready">
            <a className={`${styles.headItem} ${styles.headItemBorder}`}>
              Login
            </a>
          </Link>
          <Link href="/not_ready">
            <a className={styles.headItem}>Register</a>
          </Link>
        </div>
      </div>

      {/* Head search and checkout */}
      <div className={styles.shopHead}>
        <Link href="/">
          <a className={styles.shopHeadItem}>LOGO</a>
        </Link>
        <div className={styles.shopHeadItem}>
          <form className={styles.searchForm} onSubmit={onSubmitSearch}>
            <div className={styles.searchField}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChangeSearchTerm}
                required
              />
            </div>
            <button type="submit">Search</button>
          </form>
        </div>
        <div className={styles.shopHeadItem}>Checkout Icon</div>
      </div>

      {/* Brand list */}
      <main>{children}</main>
    </>
  );
};

export default Layout;
