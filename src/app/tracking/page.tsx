// Track Shipment page (Flow V4)
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ShipmentStatus } from '../../domain/Shipment';
import { TrackingSource } from '../../domain/TrackingUpdate';

interface TimelineItem {
  status: ShipmentStatus;
  location: string;
  source: TrackingSource;
  timestamp: string;
}

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.UNASSIGNED]: 'Chưa phân công',
  [ShipmentStatus.PENDING]: 'Đã phân công',
  [ShipmentStatus.PICKED_UP]: 'Đã lấy hàng',
  [ShipmentStatus.IN_TRANSIT]: 'Đang vận chuyển',
  [ShipmentStatus.DELIVERED]: 'Đã giao',
  [ShipmentStatus.EXCEPTION]: 'Ngoại lệ',
};

export default function TrackingPage() {
  const [trackingNo, setTrackingNo] = useState('TRK-001');
  const [status, setStatus] = useState(ShipmentStatus.PICKED_UP);
  const [location, setLocation] = useState('Ho Chi Minh City');
  const [source, setSource] = useState(TrackingSource.GPS);
  const [currentStatus, setCurrentStatus] = useState<ShipmentStatus | null>(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [history, setHistory] = useState<TimelineItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryTracking = params.get('trackingNo');
    if (queryTracking) setTrackingNo(queryTracking);
  }, []);

  const searchShipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setCurrentStatus(null);
    setCurrentLocation('');
    setHistory([]);

    if (!trackingNo.trim()) {
      setError('Mã theo dõi không được để trống.');
      return;
    }

    setError(
      'TrackingService cần được gọi bởi SmartFMController để tải dữ liệu lưu trữ. ' +
            'Trang này hiện cung cấp presentation layer và validation cho Flow V4.',
    );
  };

  const addDemoUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!trackingNo.trim()) {
      setError('Mã theo dõi không được để trống.');
      return;
    }
    if (!location.trim() && currentLocation === '') {
      setError('Vui lòng nhập vị trí hoặc sử dụng vị trí cuối cùng.');
      return;
    }

    const resolvedLocation = location.trim() || currentLocation;
    const item: TimelineItem = {
      status,
      location: resolvedLocation,
      source,
      timestamp: new Date().toLocaleString('vi-VN'),
    };

    setCurrentStatus(status);
    setCurrentLocation(resolvedLocation);
    setHistory((items) => [...items, item]);
  };

  return (
        <main style={{ maxWidth: 820, margin: '40px auto', padding: 24 }}>
            <h1>Theo dõi đơn hàng</h1>
            <p>Flow V4 — tra cứu mã theo dõi và hiển thị lịch sử trạng thái.</p>

            <form onSubmit={searchShipment} style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <input
                    value={trackingNo}
                    onChange={(event) => setTrackingNo(event.target.value)}
                    placeholder="TRK-001"
                    aria-label="Mã theo dõi"
                    style={{ flex: 1, padding: 10 }}
                />
                <button type="submit" style={{ padding: '10px 16px' }}>Tra cứu</button>
            </form>

            {error && <p role="alert" style={{ marginTop: 16 }}>{error}</p>}

            {currentStatus && (
                <section style={{ marginTop: 28 }}>
                    <h2>{STATUS_LABELS[currentStatus]}</h2>
                    <p>Vị trí hiện tại: {currentLocation}</p>
                    <h3>Lịch sử tracking</h3>
                    <ol>
                        {history.map((item, index) => (
                            <li key={`${item.timestamp}-${index}`} style={{ marginBottom: 12 }}>
                                <strong>{STATUS_LABELS[item.status]}</strong>
                                <div>{item.location}</div>
                                <small>{item.source} · {item.timestamp}</small>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            <section style={{ marginTop: 32 }}>
                <h2>Cập nhật trạng thái</h2>
                <form onSubmit={addDemoUpdate} style={{ display: 'grid', gap: 12 }}>
                    <label>
                        Trạng thái
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as ShipmentStatus)}
                            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                        >
                            {Object.values(ShipmentStatus).filter((value) => value !== ShipmentStatus.UNASSIGNED).map((value) => (
                                <option key={value} value={value}>{STATUS_LABELS[value]}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Vị trí
                        <input
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            placeholder="GPS hoặc vị trí cuối cùng"
                            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                        />
                    </label>

                    <label>
                        Nguồn cập nhật
                        <select
                            value={source}
                            onChange={(event) => setSource(event.target.value as TrackingSource)}
                            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                        >
                            {Object.values(TrackingSource).map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </label>

                    <button type="submit" style={{ padding: 12 }}>Thêm cập nhật</button>
                </form>
            </section>
        </main>
  );
}
