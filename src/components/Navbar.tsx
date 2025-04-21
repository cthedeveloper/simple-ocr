import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const isAuthenticated = true;

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-[#00695C] shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#004D40] focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=500"
                    alt="OCR Tool Logo"
                  />
                  <span className="text-white font-semibold ml-3 text-lg tracking-wide">
                    OCRMate
                  </span>
                </div>
              </div>

              {/* Right section */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      className="relative rounded-full bg-[#00695C] p-1 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4">
                      <div>
                        <MenuButton className="flex rounded-full bg-[#004D40] p-1 text-sm focus:outline-none focus:ring-2 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                            alt="User avatar"
                          />
                        </MenuButton>
                      </div>
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none">
                        {["Your Profile", "Sign out"].map((item) => (
                          <MenuItem key={item}>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item}
                              </a>
                            )}
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <a
                      href="/login"
                      className="text-sm font-medium text-white bg-[#004D40] px-4 py-2 rounded-md hover:bg-[#00332D]"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="text-sm font-medium text-white bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-400"
                    >
                      Sign Up
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Panel */}
          <DisclosurePanel className="sm:hidden px-4 pt-4 pb-3 bg-[#004D40]">
            {isAuthenticated ? (
              <div className="text-white">Welcome back!</div>
            ) : (
              <div className="flex flex-col gap-2">
                <a
                  href="/login"
                  className="bg-[#004D40] text-white text-sm px-4 py-2 rounded hover:bg-[#00332D]"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-teal-500 text-white text-sm px-4 py-2 rounded hover:bg-teal-400"
                >
                  Sign Up
                </a>
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
