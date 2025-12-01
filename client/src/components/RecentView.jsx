import React, { useState } from 'react';

const RecentView = () => {
    const [hoveredProduct, setHoveredProduct] = useState(null);

    return (
        <div className="w-full mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-center mb-8">Recently Viewed</h1>
         
            {/* <div className="flex justify-center items-center mt-8">
                <button className="text-blacktext border border-text py-2 px-6 hover:text-white hover:bg-blacktext transition-all">View More</button>
            </div> */}
        </div>
    );
};

export default RecentView;
