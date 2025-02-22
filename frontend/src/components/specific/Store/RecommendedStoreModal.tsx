import { useNavigate } from "react-router-dom";
import Modal from "../../common/Modal";
import useRootStore from "../../../stores";

interface RecommendStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedStores?: RecommendedStore[] | null;
  error: Error | null;
  isLoading: boolean;
}

const RecommendStoreModal = ({
  isOpen,
  onClose,
  recommendedStores,
  error,
  isLoading,
}: RecommendStoreModalProps) => {
  const navigate = useNavigate();
  const { memberInfo } = useRootStore();

  const goToStoreDetail = (storeId: number) => {
    navigate(`/store/${storeId}`);
  };

  const calculateAgeGroup = (birth?: string): string => {
    if (!birth) return "알 수 없음";
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(birth.slice(0, 4), 10);
    const age = currentYear - birthYear;
    const ageGroup = Math.floor(age / 10) * 10;
    return `${ageGroup}대`;
  };

  const age = calculateAgeGroup(memberInfo?.birth ?? "");

  if (error) {
    console.error("Error fetching recommended stores:", error);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {memberInfo && `${age}를 위한 `}매장 추천
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            매장 정보를 불러오는데 실패했습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedStores?.map((store: RecommendedStore) => (
              <div
                key={store.storeId}
                className="flex items-start space-x-4 p-4 border rounded-lg bg-white hover:shadow-lg hover:bg-slate-50 transition-shadow cursor-pointer"
                onClick={() => goToStoreDetail(store.storeId)}
              >
                <img
                  src={store.storeImg}
                  alt={store.storeName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{store.storeName}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {store.storeDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RecommendStoreModal;
