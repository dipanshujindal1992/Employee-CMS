import React, { useEffect } from "react";
import Card from "../components/common/Card";
import { MapPin, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchWorkLocationsRequest } from "../redux/services/workLocationSlice";

const WorkLocation: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector(
    (state: RootState) => state?.workLocation?.workLocations,
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchWorkLocationsRequest({}));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Work Locations
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage your office locations
              </p>
            </div>
          </div>
        </motion.div>
        {/* we can use it later */}
        {/* <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CustomButton
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xl shadow-primary/20"
          >
            New Work Location
          </CustomButton>
        </motion.div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {location?.map((loc, index) => (
            <motion.div
              key={loc._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                noPadding
                className="h-full relative group hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* Top Row: Name and Actions */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {loc.name}
                    </h3>
                    {/* we can use it later */}
                    {/* <div className="flex items-center gap-1 opacity-100">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div> */}
                  </div>

                  {/* Address Section */}
                  <div className="text-sm text-slate-600 space-y-1 mb-6 flex-grow">
                    <p>{loc.address1}</p>
                    <p>
                      {loc.city}, {loc.state} {loc.pincode}
                    </p>
                  </div>

                  {/* Bottom Row: Employees and Badge */}
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                      {loc.employeeCount || 0} Employees
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(WorkLocation);
