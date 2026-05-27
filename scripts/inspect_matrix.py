import pandas as pd

df = pd.read_excel('scripts/carrier_booking_matrix_copy.xlsx', sheet_name='FEWB')
target_pols = {'BDCGP','CNNBO','CNNGB','CNTAO','CNQDG','CNXMN','CNXMG','CNYTN','CNSHA'}
target_pods = {'NLRTM','BEANR','SIKOP','ESBCN'}
mask = df['POL Code'].isin(target_pols) & df['POD Code'].isin(target_pods)
sub = df[mask]
print('Filtered rows:', len(sub))
print()
for (pol, pod), grp in sub.groupby(['POL Code', 'POD Code']):
    carriers = grp.groupby(['Carrier', 'Prio'])[['Service Name', 'Transit Time']].first().reset_index()
    print(pol + ' -> ' + pod + ':')
    for _, r in carriers.iterrows():
        prio = int(r['Prio'])
        carrier = r['Carrier']
        svc = r['Service Name']
        tt = r['Transit Time']
        print('  P' + str(prio) + ' ' + carrier + ': ' + str(svc) + '  (TT: ' + str(tt) + ')')
