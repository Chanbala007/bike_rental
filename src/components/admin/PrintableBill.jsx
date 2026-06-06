import React from 'react'

const PrintableBill = ({ booking, bikeName }) => {
  if (!booking) return null;

  // Format dates for display (DD/MM/YYYY)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const calculateDays = () => {
    if (!booking.pickupDate || !booking.dropDate) return 1;
    const start = new Date(booking.pickupDate);
    const end = new Date(booking.dropDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays || 1;
  }

  const days = calculateDays();
  const ratePerDay = booking.totalPrice ? (booking.totalPrice / days).toFixed(2) : '';

  const BillSection = () => (
    <div className="w-full border-[3px] border-black font-sans text-black bg-white mb-8">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b-[3px] border-black h-[100px]">
        <div className="w-1/4"></div>
        <div className="text-center w-1/2 flex flex-col items-center justify-center mt-[-10px]">
          <span className="text-[12px] font-bold mb-1">ஸ்ரீ முருகன் துணை!</span>
          <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tighter" style={{ fontFamily: 'Times New Roman, serif', transform: 'scaleY(1.2)' }}>RETRO BIKE RENT</h1>
        </div>
        <div className="w-1/4 text-right font-bold text-xl leading-snug">
          <div>7806974223</div>
          <div>9566174223</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col">
        {/* Row 1 */}
        <div className="flex border-b-[3px] border-black min-h-[100px]">
          <div className="w-1/2 border-r-[3px] border-black p-3 flex flex-col justify-between">
            <div className="font-bold text-sm flex gap-2">DATE: <span className="font-normal">{formatDate(booking.pickupDate)}</span></div>
            <div className="font-bold text-sm flex gap-2">OUT TIME: <span className="font-normal">{booking.pickupTime}</span></div>
            <div className="font-bold text-sm flex gap-2">RETURN DATE & TIME: <span className="font-normal">{formatDate(booking.dropDate)} {booking.dropTime}</span></div>
          </div>
          <div className="w-1/2 p-3">
            <div className="font-bold text-sm flex gap-2">MOBILE NUMBER: <span className="font-normal">{booking.customerPhone}</span></div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex border-b-[3px] border-black min-h-[120px]">
          <div className="w-1/2 border-r-[3px] border-black p-3 flex flex-col justify-between relative">
            <div className="font-bold text-sm flex gap-2">NAME: <span className="font-normal">{booking.customerName}</span></div>
            <div className="font-bold text-sm flex items-center pr-12">
              <span>ID NUMBER: </span>
              <div className="absolute right-6 w-8 h-8 border-2 border-black rounded-md"></div>
            </div>
            <div className="font-bold text-sm flex gap-2">GUEST HOUSE NAME : <span className="font-normal"></span></div>
          </div>
          <div className="w-1/2 p-3">
            <div className="font-bold text-sm flex gap-2">BIKE NUMBER: <span className="font-normal">{bikeName || booking.bikeId}</span></div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex border-b-[3px] border-black min-h-[90px]">
          <div className="w-1/4 border-r-[3px] border-black p-3">
            <div className="font-bold text-sm flex gap-2">PER DAY RENT: <span className="font-normal">{ratePerDay}</span></div>
          </div>
          <div className="w-1/4 border-r-[3px] border-black p-3">
            <div className="font-bold text-sm flex gap-2">ADVANCE: <span className="font-normal"></span></div>
          </div>
          <div className="w-1/2 p-3">
            <div className="font-bold text-sm flex gap-2">ADDRESS: <span className="font-normal"></span></div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex min-h-[100px]">
          <div className="w-1/4 border-r-[3px] border-black p-3">
            <div className="font-bold text-sm flex flex-col sm:flex-row gap-1 sm:gap-2"><span>TOTAL AMOUNT:</span> <span className="font-normal">{booking.totalPrice}</span></div>
          </div>
          <div className="w-1/4 border-r-[3px] border-black p-3">
            <div className="font-bold text-sm flex flex-col sm:flex-row gap-1 sm:gap-2"><span>REFUNDABLE AMOUNT:</span> <span className="font-normal"></span></div>
          </div>
          <div className="w-[30%] border-r-[3px] border-black p-3">
            <div className="font-bold text-sm flex gap-2">SIGNATURE: </div>
          </div>
          <div className="w-[20%] p-3 flex items-center justify-between">
            <div className="flex items-center justify-center w-12 h-12 ml-2">
               <svg viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" className="w-10 h-10">
                 <path d="M12 2C6.48 2 2 6.48 2 12v3c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h2v-7H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v7h2c1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2v-3c0-5.52-4.48-10-10-10zm-5 13v3H5v-3h2zm12 3h-2v-3h2v3z"/>
               </svg>
            </div>
            <div className="flex flex-col gap-3 font-bold text-xs mr-2">
              <div className="flex items-center justify-between w-14"><span>YES</span> <div className="w-5 h-5 border-2 border-black rounded-md"></div></div>
              <div className="flex items-center justify-between w-14"><span>NO</span> <div className="w-5 h-5 border-2 border-black rounded-md"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="printable-bill hidden print:block bg-white text-black font-sans w-full max-w-[210mm] mx-auto min-h-[297mm]">
      <div className="p-[10mm]">
        {/* Render two copies of the bill to match the reference PDF layout */}
        <BillSection />
        <BillSection />
      </div>
      
      {/* Print styles applied globally when printing */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          .printable-bill, .printable-bill * { visibility: visible; }
          .printable-bill { 
            display: block !important; 
            width: 210mm;
            min-height: 297mm;
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default PrintableBill
