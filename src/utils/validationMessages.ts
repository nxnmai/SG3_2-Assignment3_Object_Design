// Vietnamese validation messages — U3 compliance: plain language, actionable guidance
// Import in UI components: import { validationMessages } from '@/utils/validationMessages'

export const validationMessages = {
  // Generic
  required: (field: string) => `${field} không được để trống. Vui lòng nhập ${field.toLowerCase()}.`,
  invalidFormat: (field: string, example: string) => `${field} không đúng định dạng. Ví dụ: ${example}`,

  // Customer / Profile
  invalidPhone: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số (ví dụ: 0901234567).',
  invalidEmail: 'Email không hợp lệ. Ví dụ: user@example.com.',
  invalidName: 'Tên chỉ được chứa chữ cái và khoảng trắng.',
  invalidAddress: 'Địa chỉ không được để trống. Vui lòng nhập đầy đủ (số nhà, đường, quận, thành phố).',
  duplicateCustomer: 'Khách hàng đã tồn tại với số điện thoại/email này.',

  // Order / Shipment
  invalidOrigin: 'Vui lòng chọn điểm đi.',
  invalidDestination: 'Vui lòng chọn điểm đến.',
  sameOriginDestination: 'Điểm đi và điểm đến không được trùng nhau.',
  invalidDate: 'Ngày không hợp lệ. Vui lòng chọn hôm nay hoặc ngày trong tương lai.',
  invalidGoodsType: 'Vui lòng chọn loại hàng hóa.',
  invalidWeight: 'Trọng lượng phải là số dương (kg).',
  weightExceedsCapacity: (max: number) => `Trọng lượng vượt quá khả năng chở (${max} kg). Vui lòng chọn xe lớn hơn hoặc chia đơn.`,
  invalidDimensions: 'Kích thước: Dài x Rộng x Cao (cm) — ví dụ: 30x20x15.',
  noOfferingFound: 'Không tìm thấy dịch vụ phù hợp. Thử thay đổi điểm đi/đến hoặc ngày.',

  // Payment
  invalidAmount: 'Số tiền phải lớn hơn 0.',
  amountExceedsBalance: (balance: number) => `Số tiền vượt quá số dư nợ (${balance.toLocaleString()} VND).`,
  invalidCardToken: 'Thông tin thẻ không hợp lệ. Vui lòng thử lại.',
  invoiceAlreadyPaid: 'Hóa đơn này đã được thanh toán.',
  invoiceNotFound: 'Không tìm thấy hóa đơn.',
  paymentDeclined: 'Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.',
  paymentMethodRequired: 'Vui lòng chọn phương thức thanh toán (Tiền mặt / Thẻ / Chuyển khoản).',

  // Assignment
  noAvailableVehicle: 'Không có xe phù hợp khả dụng tại chi nhánh này. Vui lòng thử chi nhánh khác hoặc đợi xe trả.',
  noAvailableDriver: 'Không có tài xế phù hợp khả dụng. Vui lòng thử lại sau.',
  invalidBranch: 'Chi nhánh không tồn tại.',
  vehicleNotAvailable: 'Xe đã được phân công cho đơn khác.',
  driverNotAvailable: 'Tài xế đã có đơn hàng hoặc hết hạn bằng lái.',
  licence.',

  // Tracking
  invalidTrackingNumber: 'Mã theo dõi không tồn tại. Vui lòng kiểm tra lại.',
  gpsUnavailable: 'Không thể lấy vị trí GPS. Hiển thị vị trí cuối cùng đã biết.',
  invalidStatus: 'Trạng thái không hợp lệ.',
  driverMaxTaps: 'Cập nhật trạng thái chỉ cần 3 thao tác từ màn hình chính.',

  // General / System
  serverError: 'Lỗi hệ thống. Vui lòng thử lại sau vài phút.',
  networkError: 'Mất kết nối. Kiểm tra internet và thử lại.',
  sessionExpired: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
  accessDenied: 'Bạn không có quyền thực hiện hành động này.',
};

// Helper: get message with optional interpolation
export function getMessage(key: keyof typeof validationMessages, ...args: any[]): string {
  const msg = validationMessages[key];
  return typeof msg === 'function' ? msg(...args) : msg;
}