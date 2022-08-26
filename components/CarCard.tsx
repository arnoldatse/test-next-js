import { FunctionComponent } from "react";
import styles from "../styles/CarItemList.module.css";
import Image from "next/image";
import Link from "next/link";

export interface CarListInterface {
  id: string;
  title: string;
  imageUrl: string;
  year: string;
  city: string;
  state: string;
  sellingCondition: string;
  hasWarranty: boolean;
  marketplacePrice: number;
  marketplaceOldPrice: number;
  transmission: string;
  mileage: number;
  mileageUnit: string;
}

const CarCard: FunctionComponent<{ car: CarListInterface }> = ({ car }) => {
  return (
    <Link href={`/cars/car/${car.id}`}>
      <a className={styles.item}>
        {car.sellingCondition && <span className={styles.itemNew}>New</span>}
        <Image
          className={styles.carImg}
          src={car.imageUrl}
          alt="All cars"
          width="100%"
          height={180}
        />
        <div className={styles.itemTitleContainer}>
          <h5 className={styles.itemTitle}>{car.title}</h5>
        </div>
        <div className={styles.itemInfos}>
          <div>
            <span className={styles.itemPrice}>{car.marketplacePrice.toLocaleString()} FCFA</span>
          </div>
          <div className={styles.itemOtherInfos}>
            <span>{car.year}</span>
            <span>
              {car.mileage} {car.mileageUnit}
            </span>
            <span>
              {car.city}, {car.state}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CarCard;
