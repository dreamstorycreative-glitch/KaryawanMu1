import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Coffee,
  Play,
  LogOut,
  Laptop,
  Compass,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    currentUser,
    company,
    updateCompany,
    attendanceRecords,
    todayEmployeeAttendance,
    performAttendanceCheckIn,
    performAttendanceCheckOut,
    performBreakStart,
    performBreakEnd,
    mockCurrentDistance,
    setMockCurrentDistance,
  } = useApp();

  const [messageBanner, setMessageBanner] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  const radiusLimit = company.officeCoordinates.radiusMeters;
  const isInsideRadius = mockCurrentDistance <= radiusLimit;

  const handleCheckIn = () => {
    const res = performAttendanceCheckIn();
    setMessageBanner({
      text: res.message,
      type: res.inRadius ? 'success' : 'warning',
    });
  };

  const handleCheckOut = () => {
    const res = performAttendanceCheckOut();
    setMessageBanner({ text: res.message, type: 'success' });
  };

  const handleBreakToggle = () => {
    if (!todayEmployeeAttendance?.breakStart) {
      performBreakStart();
      setMessageBanner({ text: 'Waktu istirahat dimulai. Selamat rehat!', type: 'success' });
    } else {
      performBreakEnd();
      setMessageBanner({ text: 'Kembali bekerja dicatat. Semangat kembali beraktivitas!', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Presensi Kantor & GPS Geofencing</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Sistem pencatatan waktu kerja presisi tinggi dengan validasi radius kantor {radiusLimit}m dan deteksi perangkat.
          </p>
        </div>

        {/* GPS Radius Simulator Slider (Interactive Demo Test) */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-xs min-w-[280px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              Simulasi Jarak dari Kantor:
            </span>
            <span className={`font-mono font-bold ${isInsideRadius ? 'text-emerald-400' : 'text-rose-400'}`}>
              {mockCurrentDistance} m
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="350"
            value={mockCurrentDistance}
            onChange={(e) => setMockCurrentDistance(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Dalam Kantor (0m)</span>
            <span className="text-indigo-300 font-mono">Batas: {radiusLimit}m</span>
            <span>Luar Area (350m)</span>
          </div>
        </div>
      </div>

      {/* Geofence Status Alert */}
      {messageBanner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            messageBanner.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {messageBanner.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span>{messageBanner.text}</span>
          </div>
          <button
            onClick={() => setMessageBanner(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Live Check-in Panel & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Panel (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Presensi Hari Ini</span>
              <span className="text-[11px] font-mono text-slate-400">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs text-slate-400 mt-1">Waktu Indonesia Barat (WIB)</span>
              </div>

              {/* Status pill */}
              <div className="mt-4">
                {isInsideRadius ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Dalam Radius Kantor ({mockCurrentDistance}m)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Di Luar Area Kantor ({mockCurrentDistance}m)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Check-in info box */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Jam Masuk Kantor:</span>
                <span className="font-mono text-white">09:00 WIB</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Jam Pulang Standar:</span>
                <span className="font-mono text-white">18:00 WIB</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Waktu Masuk Anda:</span>
                <span className="font-mono text-indigo-400 font-semibold">
                  {todayEmployeeAttendance?.checkIn || 'Belum Presensi'}
                </span>
              </div>
              {todayEmployeeAttendance?.checkOut && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Waktu Pulang Anda:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {todayEmployeeAttendance.checkOut}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5">
            {!todayEmployeeAttendance ? (
              <button
                onClick={handleCheckIn}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Check In (Masuk Kantor)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleBreakToggle}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 py-2.5 text-xs font-medium transition-colors"
                >
                  <Coffee className="h-4 w-4 text-amber-400" />
                  <span>
                    {!todayEmployeeAttendance.breakStart
                      ? 'Mulai Istirahat (Break)'
                      : !todayEmployeeAttendance.breakEnd
                      ? 'Selesai Istirahat (Resume)'
                      : 'Istirahat Selesai'}
                  </span>
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!!todayEmployeeAttendance.checkOut}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white py-2.5 text-xs font-semibold shadow-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{todayEmployeeAttendance.checkOut ? 'Sudah Check Out' : 'Check Out (Pulang)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timeline & Audit Logs (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Timeline Kehadiran & Audit Log</h3>
                <p className="text-xs text-slate-400">Verifikasi otomatis oleh AI HR Worker</p>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                IP & Device Validated
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((rec) => (
                  <div key={rec.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{rec.employeeName}</p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              rec.status === 'hadir'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : rec.status === 'terlambat'
                                ? 'bg-orange-500/10 text-orange-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Jarak Presensi: {rec.distanceMeters}m · {rec.deviceInfo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{rec.checkIn}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{rec.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  <Clock className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p>Belum ada presensi yang tercatat hari ini.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Klik tombol Check In untuk melakukan presensi pertama.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Koordinat Kantor: -6.2088°, 106.8456°</span>
            <span>Radius Kantor: {radiusLimit} Meter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
