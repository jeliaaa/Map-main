import { X, Users, MapPin, Calendar, Euro, Target, Share, CheckCircle, Building2, Heart, Globe } from 'lucide-react';
import useProjectModal from '../../hooks/useProjectModal';

const ProjectModal = () => {
  const { isOpen, onClose, data } = useProjectModal()

  if (!isOpen || !data) return null;

  const project = data;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >

      <div className="absolute inset-0 bg-gradient-to-br backdrop-blur-sm animate-in fade-in duration-300" />
      
      <div 
        id='info-cont'
        className="relative w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out overflow-y-scroll sm:overflow-y-hidden max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >


        <div className="relative bg-indigo-600 px-8 py-6">

          <div className="relative flex items-start justify-between">
            <button
                onClick={onClose}
                className="p-2 text-white/80 fixed sm:absolute right-10 sm:right-0 hover:text-white cursor-pointer bg-indigo-600 rounded-xl transition-all duration-200 group flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-3 mb-3">
                <button className="p-2 cursor-pointer bg-white/20 rounded-xl backdrop-blur-sm">
                  <Share className="w-6 h-6 text-white" />
                </button>
                <div className="text-white/90 text-sm font-medium">
                  {project.year} • {project.duration.number} თვე
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight mb-4">
                {project.title}
              </h1>
              {/* <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{project.organization}</span>
                </div>
              </div> */}
            </div>
            
          </div>
        </div>

        <div id='info-cont' className="overflow-y-hidden sm:overflow-y-auto pb-5 sm:h-[500px]">

          <div className="p-8 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Euro className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">ბიუჯეტი</p>
                    <p className="text-xl font-bold text-green-800">
                      {project.budget.number.toLocaleString()} {project.budget.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">დონორი</p>
                    <p className="text-lg font-bold text-blue-800">{project.donor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">მდებარეობა</p>
                    <p className="text-lg font-bold text-purple-800">{project.location.length} მუნიციპალიტეტი</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 space-y-8">

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">ორგანიზაცია</h2>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed">{project.organization}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">პროექტის მიზანი</h2>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed">{project.goal}</p>
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">პარტნიორები</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.partners.map((partner, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="font-medium text-indigo-900">{partner.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">აქტივობები</h2>
              </div>
              <div className="space-y-3">
                {project.activities.map((activity, index) => (
                  <div key={index} className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

      
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">შედეგები</h2>
              </div>
              <div className="space-y-3">
                {project.results.map((result, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">{result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">განხორციელების ადგილები</h2>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                <div className="flex flex-wrap gap-3">
                  {project.location.map((loc, index) => (
                    <div key={index} className="bg-white border border-purple-200 rounded-xl px-4 py-2 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-900 font-medium">{loc.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProjectModal