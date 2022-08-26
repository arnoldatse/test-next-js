import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { BrandInterface, BrandPropsInterface } from "../components/BrandCard";
import BrandCard from "../components/BrandCard";
import { useEffect, useState } from "react";

const Home: NextPage<{ brands: BrandInterface[] }> = ({ brands }) => {
  const [stateBrands, setStateBrands] = useState<BrandPropsInterface[]>(brands)

  useEffect(()=>{
    const newStateBrands: BrandPropsInterface[] = [...brands]
    newStateBrands.push({ href:"/cars", name:"Toutes les voitures" , imageUrl:"/assets/pictures/all_cars.jpg" })
    setStateBrands(newStateBrands)
  }, [brands])
  return (
    <div className={styles.brandsList}>
      <h2 className={styles.title}>BRANDS</h2>
      <div className={styles.content}>
        {stateBrands.map((brand, index) => {
          return (
            <BrandCard brand={brand} key={index}/>
          );
        })}
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
