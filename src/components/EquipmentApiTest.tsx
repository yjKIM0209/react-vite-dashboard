import { useState } from "react";
import { searchEquipment } from "@/api/equipment";
import type { EquipmentApi } from "@/types/equipment";
import axios from "axios";

const EquipmentApiTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<EquipmentApi[] | null>(null);

  const handleApiCall = async () => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      console.log("API 호출 시작...");
      const data = await searchEquipment();
      console.log("API 호출 성공:", data);
      setResponseData(data);
    } catch (err) {
      console.error("API 호출 실패:", err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      }
      else if (err instanceof Error) {
        setError(err.message);
      }
      else {
        setError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "2rem", textAlign: "left" }}>
        <h1>장비 API 테스트 화면</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          아래 버튼을 누르면 GET 'http://192.168.50.75:8080/equipment/search'
          API를 호출합니다.
        </p>

        <button
          onClick={handleApiCall}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            marginBottom: "2rem",
          }}
        >
          {isLoading ? "호출 중..." : "장비 목록 조회"}
        </button>

        <hr style={{ border: "1px solid #eee", marginBottom: "2rem" }} />

        <div>
          <h3>API 응답 결과 (Response Body)</h3>

          {isLoading && (
            <p style={{ color: "#007bff" }}>데이터를 불러오는 중입니다...</p>
          )}

          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff3f3",
                border: "1px solid #ffcccc",
                color: "#cc0000",
                borderRadius: "4px",
              }}
            >
              <strong>에러 발생:</strong> {error}
            </div>
          )}

          {responseData && (
            <div>
              <p style={{ color: "#28a745", fontWeight: "bold" }}>
                호출 성공! 총 {responseData.length}개의 장비가 조회되었습니다.
              </p>
              <pre
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1rem",
                  border: "1px solid #e9ecef",
                  borderRadius: "4px",
                  overflowX: "auto",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          )}

          {!isLoading && !error && !responseData && (
            <p style={{ color: "#999" }}>버튼을 눌러 API를 호출해 주세요.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EquipmentApiTest;
