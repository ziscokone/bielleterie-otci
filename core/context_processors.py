VEHICULE_PARC_VIEWS = {
    'vehicule_list', 'vehicule_create', 'vehicule_update', 'vehicule_delete',
    'modele_list', 'modele_create', 'modele_update', 'modele_delete',
}


def active_module(request):
    match = getattr(request, 'resolver_match', None)
    if not match:
        return {'active_module': None}

    app = match.app_name
    view = match.url_name

    if app == 'vehicules':
        module = 'parc' if view in VEHICULE_PARC_VIEWS else 'garage'
    elif app in ('lignes', 'destinations', 'gares', 'programmes'):
        module = 'trajets'
    elif app == 'personnel':
        module = 'personnel'
    elif app in ('guichet', 'clients', 'comptabilite', 'billets', 'voyages'):
        module = 'voyages'
    else:
        module = None

    return {'active_module': module}
