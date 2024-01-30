import Page from "./Page.ts";

export default class HomePage extends Page {
    public override matches(location: Location) {
        return location.pathname.match(/^\/*$/) !== null;
    }

    public override async open() {
        this.app.ownerDocument.title = "Home";
        this.app.innerHTML = `
  <header class="bg-gray-50 relative">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center py-32">
        <h1 class="text-4xl sm:text-6xl tracking-tight font-display font-medium text-gray-900">LZ2???</h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
      </div>
      <div class="grid grid-cols-3 gap-6 pb-16">
        <div class="flex gap-6">
          <div class="w-10 h-10 bg-blue-50 shrink-0 ring-2 ring-blue-500 text-blue-500 ring-inset rounded-lg shadow-md shadow-blue-500/[.12] flex items-center justify-center" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 7.5 16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0 0 12 6.75Zm-1.683 6.443-.005.005-.006-.005.006-.005.005.005Zm-.005 2.127-.005-.006.005-.005.005.005-.005.005Zm-2.116-.006-.005.006-.006-.006.005-.005.006.005Zm-.005-2.116-.006-.005.006-.005.005.005-.005.005ZM9.255 10.5v.008h-.008V10.5h.008Zm3.249 1.88-.007.004-.003-.007.006-.003.004.006Zm-1.38 5.126-.003-.006.006-.004.004.007-.006.003Zm.007-6.501-.003.006-.007-.003.004-.007.006.004Zm1.37 5.129-.007-.004.004-.006.006.003-.004.007Zm.504-1.877h-.008v-.007h.008v.007ZM9.255 18v.008h-.008V18h.008Zm-3.246-1.87-.007.004L6 16.127l.006-.003.004.006Zm1.366-5.119-.004-.006.006-.004.004.007-.006.003ZM7.38 17.5l-.003.006-.007-.003.004-.007.006.004Zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007Zm-.5 1.873h-.008v-.007h.008v.007ZM17.25 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 4.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
          </div>
          <div>
            <p class="text-sm font-semibold leading-6 text-gray-900">Baofeng M-13 Pro</p>
            <p class="mt-2 text-sm leading-6 text-gray-700">Anim aute id magna aliqua ad ad non deserunt sunt.</p>
          </div>
        </div>
        <div class="flex gap-6">
          <div class="w-10 h-10 bg-blue-50 shrink-0 ring-2 ring-blue-500 text-blue-500 ring-inset rounded-lg shadow-md shadow-blue-500/[.12] flex items-center justify-center" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 7.5 16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0 0 12 6.75Zm-1.683 6.443-.005.005-.006-.005.006-.005.005.005Zm-.005 2.127-.005-.006.005-.005.005.005-.005.005Zm-2.116-.006-.005.006-.006-.006.005-.005.006.005Zm-.005-2.116-.006-.005.006-.005.005.005-.005.005ZM9.255 10.5v.008h-.008V10.5h.008Zm3.249 1.88-.007.004-.003-.007.006-.003.004.006Zm-1.38 5.126-.003-.006.006-.004.004.007-.006.003Zm.007-6.501-.003.006-.007-.003.004-.007.006.004Zm1.37 5.129-.007-.004.004-.006.006.003-.004.007Zm.504-1.877h-.008v-.007h.008v.007ZM9.255 18v.008h-.008V18h.008Zm-3.246-1.87-.007.004L6 16.127l.006-.003.004.006Zm1.366-5.119-.004-.006.006-.004.004.007-.006.003ZM7.38 17.5l-.003.006-.007-.003.004-.007.006.004Zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007Zm-.5 1.873h-.008v-.007h.008v.007ZM17.25 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 4.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
          </div>
          <div>
            <p class="text-sm font-semibold leading-6 text-gray-900">Baofeng M-13 Pro</p>
            <p class="mt-2 text-sm leading-6 text-gray-700">Anim aute id magna aliqua ad ad non deserunt sunt.</p>
          </div>
        </div>
        <div class="flex gap-6">
          <div class="w-10 h-10 bg-blue-50 shrink-0 ring-2 ring-blue-500 text-blue-500 ring-inset rounded-lg shadow-md shadow-blue-500/[.12] flex items-center justify-center" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 7.5 16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0 0 12 6.75Zm-1.683 6.443-.005.005-.006-.005.006-.005.005.005Zm-.005 2.127-.005-.006.005-.005.005.005-.005.005Zm-2.116-.006-.005.006-.006-.006.005-.005.006.005Zm-.005-2.116-.006-.005.006-.005.005.005-.005.005ZM9.255 10.5v.008h-.008V10.5h.008Zm3.249 1.88-.007.004-.003-.007.006-.003.004.006Zm-1.38 5.126-.003-.006.006-.004.004.007-.006.003Zm.007-6.501-.003.006-.007-.003.004-.007.006.004Zm1.37 5.129-.007-.004.004-.006.006.003-.004.007Zm.504-1.877h-.008v-.007h.008v.007ZM9.255 18v.008h-.008V18h.008Zm-3.246-1.87-.007.004L6 16.127l.006-.003.004.006Zm1.366-5.119-.004-.006.006-.004.004.007-.006.003ZM7.38 17.5l-.003.006-.007-.003.004-.007.006.004Zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007Zm-.5 1.873h-.008v-.007h.008v.007ZM17.25 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm0 4.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
          </div>
          <div>
            <p class="text-sm font-semibold leading-6 text-gray-900">Baofeng M-13 Pro</p>
            <p class="mt-2 text-sm leading-6 text-gray-700">Anim aute id magna aliqua ad ad non deserunt sunt.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pointer-events-none absolute inset-0 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.06)]"></div>
  </header>
    
  <main>
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between gap-8">
      <div class="flex gap-8">
        <a href="/" class="text-sm font-display font-semibold leading-6 text-gray-900">Home</a>      
      </div>
    </nav>
    <section class="py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <h2 class="font-semibold leading-6 text-gray-900">КРС Изпити</h2>
        <div class="grid grid-cols-3 gap-6 mt-4">
    
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm group">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100" aria-hidden="true"><div class="w-full h-full bg-gradient-to-br from-blue-400 via-sky-400 to-indigo-400 absolute"></div><div class="p-0.5 relative w-full h-full"><div class="w-full h-full bg-blue-50 rounded-xl"></div></div></div>
            <div class="p-6 relative">
              <a href="/crc/info">
                <h3 class="text-sm font-display font-semibold leading-6 text-gray-900">Info?</h3>
                <span aria-hidden="true" class="absolute inset-0"></span>
              </a>
              <p class="mt-2 text-sm leading-6 text-gray-700">Asd</p>
            </div>
          </div>
    
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm group">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100" aria-hidden="true"><div class="w-full h-full bg-gradient-to-br from-blue-400 via-sky-400 to-indigo-400 absolute"></div><div class="p-0.5 relative w-full h-full"><div class="w-full h-full bg-blue-50 rounded-xl"></div></div></div>
            <div class="p-6 relative">
              <a href="/crc/revise">
                <h3 class="text-sm font-display font-semibold leading-6 text-gray-900">Радиолюбителски Преговор</h3>
                <span aria-hidden="true" class="absolute inset-0"></span>
              </a>
              <p class="mt-2 text-sm leading-6 text-gray-700">Подготовка за тестовете от КРС за провеждане на изпити за правоспособност на радиолюбители</p>
            </div>
          </div>
    
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm group">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100" aria-hidden="true"><div class="w-full h-full bg-gradient-to-br from-blue-400 via-sky-400 to-indigo-400 absolute"></div><div class="p-0.5 relative w-full h-full"><div class="w-full h-full bg-blue-50 rounded-xl"></div></div></div>
            <div class="p-6 relative">
              <a href="/crc/test">
                <h3 class="text-sm font-display font-semibold leading-6 text-gray-900">Примерен Тест</h3>
                <span aria-hidden="true" class="absolute inset-0"></span>
              </a>
              <p class="mt-2 text-sm leading-6 text-gray-700">Asd</p>
            </div>
          </div>
    
        </div>
      </div>
    </section>
  </main>`;
    }
}
