import { FunctionComponent } from "react";
import styles from "../styles/BrandItemList.module.css";
import Image from "next/image";
import Link from "next/link";

export interface BrandInterface {
  id: number;
  name: string;
  imageUrl: string;
}

export interface BrandPropsInterface {
  href?: string;
  id?: number;
  name: string;
  imageUrl: string;
}


const BrandCard: FunctionComponent<{ brand: BrandPropsInterface }> = ({ brand }) => {
  return (
    <Link href={brand.href ?? "/not_ready"}>
      <a className={styles.item}>
        {brand.imageUrl && brand.imageUrl != "" && (
          <Image className={styles.itemImg} src={brand.imageUrl} alt="Image" layout="intrinsic" width={100} height={100}/>
        )}
        <h3 className={styles.itemTitle}>{brand.name}</h3>
      </a>
    </Link>
  );
};

export default BrandCard;
