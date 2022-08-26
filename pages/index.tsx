import { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";

interface BrandInterface {
  id: number;
  name: string;
  imageUrl: string;
}

const Home: NextPage<{ brands: BrandInterface[] }> = ({ brands }) => {
  return (
    <div>
      <div className={styles.brands}>
        {brands.map((brand) => {
          return (
            <Link href="/not_ready" key={brand.id}>
              <a className={styles.brand}>
                {brand.imageUrl && brand.imageUrl != "" && (
                  <Image
                    src={brand.imageUrl}
                    alt="Image"
                    width={100}
                    height={100}
                  />
                )}
                <h3>{brand.name}</h3>
              </a>
            </Link>
          );
        })}
        <Link href="/cars">
          <a className={styles.brand}>
            <Image
              src="/assets/pictures/all_cars.jpg"
              alt="All cars"
              width={100}
              height={100}
            />
            <h3>Toutes les voitures</h3>
          </a>
        </Link>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/make?popular=true`
  );
  const brands = await res
    .json()
    .then((value: { makeList: BrandInterface[] }) => value.makeList)
    .catch((error: any) => console.log(error));

  return {
    props: {
      brands,
    },
  };
}

export default Home;
