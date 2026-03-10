import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constant/routes';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { createPayrunRequest, payrunResetState, payrunListRequest, type PayrunItem, type PaySchedule } from '../../redux/services/payrunSlice';
import { formatDateGB } from '../../utils/commonFunctions';
import PayrunCard from './PayrunCard';
import ConfirmationModal from '../common/ConfirmationModal';
import CustomButton from '../common/CustomButton';


type FilterType = 'All Pending' | 'Regular Payroll' | 'One Time Payout';

const FilterChip = ({ label, count, isActive, onClick }: { label: FilterType, count: number, isActive: boolean, onClick: () => void }) => (
  <CustomButton
    variant="none"
    onClick={onClick}
    className={`
      inline-flex items-center gap-2
      px-4 py-1.5
      rounded-full border
      text-sm font-medium
      transition-colors
      whitespace-nowrap
      ${isActive
        ? 'border-[#4285F4] text-[#4285F4] bg-white'
        : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
      }
    `}
  >
    {label}
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-[#4285F4]/10 text-[#4285F4]' : 'bg-slate-100 text-slate-500'
        }`}
    >
      {count}
    </span>
  </CustomButton>
);

interface RunPayrollTabProps {
  payrunList: PayrunItem[];
  paySchedule: PaySchedule | null;
}

const RunPayrollTab: React.FC<RunPayrollTabProps> = ({ payrunList, paySchedule }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Pending');
  const dispatch = useDispatch();
  //  NEW STATE (modal only — no UI disturbance)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payrunToCreate, setPayrunToCreate] = useState<PayrunItem | null>(null);

  const earningTypes = useSelector((state: RootState) => state?.salaryComponent?.earningTypes);
  const totalCount = useSelector((state: RootState) => state?.payrun?.totalCount) || 0;

  const isCreating = useSelector((state: RootState) => state.payrun.isLoading);
  const successMessage = useSelector((state: RootState) => state.payrun.successMessage);
  const errorMessage = useSelector((state: RootState) => state.payrun.error);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(payrunResetState());
      // Re-fetch the payrun list so the created payrun is removed from pending
      dispatch(payrunListRequest({ page: 1, limit: 10 }));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(payrunResetState());
    }
  }, [successMessage, errorMessage, dispatch]);

  const oneTimePayruns = useMemo(
    () => payrunList?.filter(run => run.type === 'oneTime') || [],
    [payrunList]
  );

  const regularPayruns = useMemo(
    () => payrunList?.filter(run => run.type === 'regular' || run.type === 'regularPayroll') || [],
    [payrunList]
  );

  const offCyclePayruns = useMemo(
    () => payrunList?.filter(run => run.type === 'offCycle' || run.type === 'offCyclePayroll') || [],
    [payrunList]
  );

  const regularCount = paySchedule ? 1 : 0;
  const oneTimeCount = totalCount;
  const allPendingCount = regularCount + oneTimeCount;

  const filteredPayruns = useMemo(() => {
    if (activeFilter === 'One Time Payout') return oneTimePayruns;
    if (activeFilter === 'Regular Payroll') return regularPayruns;
    return payrunList || [];
  }, [activeFilter, oneTimePayruns, regularPayruns, offCyclePayruns, payrunList]);

  const getMatchedEarningName = useCallback(
    (earningId: string) => {
      const matchedEarning = earningTypes?.find(
        e => e._id === earningId || e.name === earningId
      );
      return matchedEarning ? matchedEarning.name : 'Component';
    },
    [earningTypes]
  );

  const handleViewDetails = useCallback(
    (payrun: PayrunItem) => {
      const isOneTime = payrun.type === 'oneTime';
      const componentName = isOneTime
        ? getMatchedEarningName(payrun.earningId || '')
        : '';

      navigate(ROUTES.PAY_RUN_DETAILS.replace(':id', payrun._id), {
        state: {
          isOneTime,
          componentName,
          date: payrun.date,
        },
      });
    },
    [getMatchedEarningName, navigate]
  );

  const handlecreateOneTimePayRun = useCallback((payrun: PayrunItem) => {
    setPayrunToCreate(payrun);
    setIsConfirmOpen(true);
  }, []);

  const handleCreatePayRun = useCallback(() => {
    setIsConfirmOpen(false);

    if (payrunToCreate) {
      dispatch(createPayrunRequest({ type: "extra", payRunId: payrunToCreate._id }));
      setPayrunToCreate(null);
    }
  }, [dispatch, payrunToCreate]);

  const handleCloseConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setPayrunToCreate(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-1">
        <FilterChip
          label="All Pending"
          count={allPendingCount}
          isActive={activeFilter === 'All Pending'}
          onClick={() => setActiveFilter('All Pending')}
        />
        <FilterChip
          label="Regular Payroll"
          count={regularCount}
          isActive={activeFilter === 'Regular Payroll'}
          onClick={() => setActiveFilter('Regular Payroll')}
        />
        <FilterChip
          label="One Time Payout"
          count={oneTimeCount}
          isActive={activeFilter === 'One Time Payout'}
          onClick={() => setActiveFilter('One Time Payout')}
        />
      </div>

      <div className="space-y-4 max-w-4xl">
        {(activeFilter === 'All Pending' || activeFilter === 'Regular Payroll') && paySchedule && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] text-slate-800 font-bold">
                Process Pay Run for {paySchedule.cycle}
              </h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="grid grid-cols-3 gap-12 w-full md:w-3/4">
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">
                    Employees' Net Pay
                  </div>
                  <div className="text-[15px] font-bold text-slate-800 bg-[#F8F9FA] px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1.5 w-fit">
                    <span className="text-[10px] text-slate-400 font-mono">
                      YET TO PROCESS
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">
                    Payment Date
                  </div>
                  <div className="text-[15px] text-slate-800 font-medium tracking-tight">{paySchedule?.cycle}</div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">
                    No. of Employees
                  </div>
                  <div className="text-[15px] text-slate-800 font-medium">
                    {paySchedule?.totalEmployees}
                  </div>
                </div>
              </div>

              <div className="md:ml-auto">
                <CustomButton
                  onClick={() => navigate(ROUTES.PAY_RUN_DETAILS)}
                  className="bg-[#D2E3FC] text-[#4285F4] text-[12px] px-4 py-2 rounded font-bold uppercase tracking-wide cursor-pointer"
                >
                  CREATE PAY RUN
                </CustomButton>
              </div>
            </div>

            {paySchedule?.totalEmployees === 0 && (
              <div className="mt-6 flex items-start gap-2.5 text-slate-500 text-[12px] bg-slate-50/50 p-2 rounded border border-slate-100/50">
                <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-bold flex-shrink-0 mt-0.5">
                  i
                </div>
                <span>
                  There are no employees, with completed profiles in this payroll.
                  Please complete their profile to process this payrun.
                </span>
              </div>
            )}
          </div>
        )}

        {filteredPayruns?.map(payrun => {
          const isOneTime = payrun.type === 'oneTime';
          const componentName = isOneTime
            ? getMatchedEarningName(payrun.earningId || '')
            : '';

          const title = isOneTime
            ? `One-time Payout (${componentName})`
            : payrun.type === 'regular' || payrun.type === 'regularPayroll'
              ? `Regular Payroll - ${formatDateGB(payrun.date)}`
              : 'Off Cycle Payroll';

          const displayDate = payrun.date ? formatDateGB(payrun.date) : '';
          const netPay = payrun.netPay || 0.0;
          const numEmployees = payrun?.employeeCount || 0;

          return (
            <PayrunCard
              key={payrun._id}
              title={title}
              status={payrun.status || "DRAFT"}
              netPay={netPay}
              paymentDate={displayDate}
              employeeCount={numEmployees}
              onViewDetails={() => handleViewDetails(payrun)}
              overdueDays={0}
              statusVariant={payrun.status?.toUpperCase() === 'APPROVED' ? 'green' : (isOneTime ? 'draft' : 'blue')}
              onCreatepayrun={() => handlecreateOneTimePayRun(payrun)}
            />
          );
        })}
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleCreatePayRun}
        isLoading={isCreating}
        title={payrunToCreate ? "Process One Time Payout?" : "Create Pay Run?"}
        message={payrunToCreate ? "Are you sure you want to process this one time payout?" : "Are you sure you want to create this pay run?"}
        confirmText="Yes"
        cancelText="No"
        variant="warning"
      />
    </div>
  );
};

export default React.memo(RunPayrollTab);