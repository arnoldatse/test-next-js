import { NextPage } from "next";
import { CarListInterface } from "../../../components/CarCard";
import { PaginationInterface } from "..";
import styles from "../../../styles/CarDetails.module.css";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";

export interface CarDetailsInterface {
  id: string;
  carName: string;
  imageUrl: string;
  year: string;
  country: string;
  city: string;
  state: string;
  mileage: number;
  mileageUnit: string;
  sellingCondition: string;
  marketplacePrice: number;
  marketplaceOldPrice: number;
  hasWarranty: boolean;
  transmission: string;
  fuelType: string;
  engineType: string;
  interiorColor: string;
  exteriorColor: string;
  bodyType: {
    id: 3;
    name: string;
    imageUrl: string;
  };
}

interface CarMediaInterface {
  id: number;
  name: string;
  url: string;
  type: string;
}

const queryClient = new QueryClient();

const Car: NextPage = () => (
  <QueryClientProvider client={queryClient}>
    <CarContent />
  </QueryClientProvider>
);

const CarContent: FunctionComponent = () => {
  const router = useRouter();
  const { id } = router.query;

  const [stateMedias, setStateMedias] = useState<ReactImageGalleryItem[]>([]);
  const [showVideo, setShowVideo] = useState<any>([]);
  const [showGalleryFullscreenButton, setShowGalleryFullscreenButton] =
    useState<boolean>(true);
  const [showFullscreenButton, setShowFullscreenButton] =
    useState<boolean>(true);
  const [showPlayButton, setShowPlayButton] = useState<boolean>(true);

  //get car infos
  const {
    isLoading: isLoadingInfos,
    isError: isErrorInfos,
    data: car,
  } = useQuery(
    ["car-infos", id],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car/${id}`
      );
      const car = await res
        .json()
        .then((value: CarDetailsInterface) => value)
        .catch((error: any) => console.log(error));

      return car;
    },
    { keepPreviousData: true }
  );

  //get car medias
  const {
    isLoading: isLoadingMedias,
    isError: isErrorMedias,
    data: medias,
  } = useQuery(
    ["car-medias", id],
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car_media?carId=${id}`
      );
      const medias = await res
        .json()
        .then(
          (value: { carMediaList: CarMediaInterface[] }) => value.carMediaList
        )
        .catch((error: any) => console.log(error));

      return medias;
    },
    { keepPreviousData: true }
  );

  const toggleShowVideo = useCallback(
    (url: any) => {
      showVideo[url] = !Boolean(showVideo[url]);
      setShowVideo(showVideo);

      if (showVideo[url]) {
        if (showPlayButton) {
          setShowPlayButton(false);
        }

        if (showFullscreenButton) {
          setShowGalleryFullscreenButton(false);
        }
      }
    },
    [showFullscreenButton, showPlayButton, showVideo]
  );

  const renderVideo = useCallback(
    (item: any) => {
      return (
        <div>
          {showVideo[item.embedUrl] ? (
            <div className="video-wrapper">
              <a
                className="close-video"
                onClick={() => toggleShowVideo(item.embedUrl)}
              ></a>
              <iframe
                width="560"
                height="315"
                src={item.embedUrl}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <a onClick={() => toggleShowVideo(item.embedUrl)}>
              <div className="play-button"></div>
              <Image
                className="image-gallery-image"
                src={item.original}
                layout="fill"
                alt="Image"
              />
              {item.description && (
                <span
                  className="image-gallery-description"
                  style={{ right: "0", left: "initial" }}
                >
                  {item.description}
                </span>
              )}
            </a>
          )}
        </div>
      );
    },
    [showVideo, toggleShowVideo]
  );

  useEffect(() => {
    if (medias) {
      const newStateMedias = medias?.map(
        (media, index): ReactImageGalleryItem => {
          const mediaImageGalleryItem: ReactImageGalleryItem = {
            thumbnail: media.url,
            original: media.url,
            sizes: "700x450",
            renderItem:
              media.type.search("video") != -1 ? renderVideo : undefined,
          };
          return mediaImageGalleryItem;
        }
      );
      setStateMedias(newStateMedias!);
    }
  }, [medias, renderVideo]);

  return (
    <>
      <div className={styles.content}>
        {car &&
        medias &&
        !isLoadingInfos &&
        !isLoadingMedias &&
        !isErrorInfos &&
        !isErrorMedias ? (
          <>
            <div className={styles.medias}>
              {car.sellingCondition && (
                <span className={styles.itemNew}>New</span>
              )}
              <ImageGallery items={stateMedias} />
              <div className={styles.itemInfos}>
                <h3>{car.carName}</h3>
                <div>
                  <span className={styles.itemPrice}>
                    {car.marketplacePrice.toLocaleString()} FCFA
                  </span>
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
            </div>

            <div className={styles.infos}>
              <div className={styles.title}>
                <h3>Informations</h3>
              </div>
              <table className={styles.tableInfos}>
                <tbody>
                  <tr className={styles.tableTr}>
                    <th className={styles.tableTh}>Interior color</th>
                    <td className={styles.tableTd}>{car.interiorColor}</td>
                  </tr>
                  <tr className={`${styles.tableTr}  ${styles.tableTrColored}`}>
                    <th className={styles.tableTh}>Exterior color</th>
                    <td className={styles.tableTd}>{car.exteriorColor}</td>
                  </tr>
                  <tr className={`${styles.tableTr}`}>
                    <th className={styles.tableTh}>body Type</th>
                    <td className={styles.tableTd}>{car.bodyType.name}</td>
                  </tr>
                  <tr className={`${styles.tableTr} ${styles.tableTrColored}`}>
                    <th className={styles.tableTh}>Transmission</th>
                    <td className={styles.tableTd}>{car.transmission}</td>
                  </tr>
                  <tr className={`${styles.tableTr}`}>
                    <th className={styles.tableTh}>fuel Type</th>
                    <td className={styles.tableTd}>{car.fuelType}</td>
                  </tr>
                  <tr className={`${styles.tableTr} ${styles.tableTrColored}`}>
                    <th className={styles.tableTh}>engine Type</th>
                    <td className={styles.tableTd}>{car.engineType}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
        {(isLoadingInfos || isLoadingMedias) &&
          [...Array(2)].map((i, index) => (
            <Skeleton
              key={index}
              width={700}
              height={651}
              style={{ margin: "40px 0" }}
            />
          ))}

        {(isErrorInfos && !isLoadingInfos) || (isErrorMedias && !isLoadingMedias) && "Une Erreur est produite"}
      </div>
    </>
  );
};

/* export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car/search`
  );
  const cars = await res
    .json()
    .then(
      (value: {
        result: CarListInterface[];
        pagination: PaginationInterface;
      }) => value.result
    )
    .catch((error: any) => console.log(error));

  const paths = cars?.map((car) => ({
    params: { id: car.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const resCar = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car/${params.id}`
  );
  const car = await resCar
    .json()
    .then((value: CarDetailsInterface) => value)
    .catch((error: any) => console.log(error));

  const resMedias = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory/car_media?carId=${params.id}`
  );
  const medias = await resMedias
    .json()
    .then((value: { carMediaList: CarMediaInterface[] }) => value.carMediaList)
    .catch((error: any) => console.log(error));

  return { props: { car, medias } };
} */

export default Car;
