# CMS Portal Disparekraf

Portal for Dinas Pariwisata dan Ekonomi Kreatif (Disparekraf) DKI Jakarta 


## Installation

Open project directory and install plugin:

```bash
  npm install
```

To run project, you can run:

```bash
  npm run dev
```

Runs the app in the development mode.\
Open [http://localhost:5171](http://localhost:5171/) to view it in the browser.

## Add New Modul
- Create new folder (module want to develop) to `/views/pages`
- Set up router in folder, then import the router at `/router/MainRoutes.ts`
- Create new axios setup in folder `/plugins` with copy `axios.ts` rename with module which want develop example : `AxiosJacation.js` then in file change baseURL
- Add module at Menu in Internal Setting
- Every want develop new menu dont forget to Add menu at Internal Setting (Menu) base on module with click Explore, because menu at layout has integrate
