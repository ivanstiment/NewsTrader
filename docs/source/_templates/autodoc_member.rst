.. py:{{ objtype }}:: {{ fullname }}{{ signature }}

{%- if obj.docstring %}
.. admonition:: Descripción

    {{ obj.docstring | escape | indent(6) }}

{%- endif %}

{%- if obj.deprecated %}
.. warning:: Deprecated
    {{ obj.deprecated }}
{%- endif %}

{%- if obj.examples %}
**Ejemplo:**

.. code-block:: python

    {{ obj.examples | indent(6) }}
{%- endif %}

{%- if obj.attributes %}
**Atributos:**
{% for attr in obj.attributes %}
- ``{{ attr.name }}``: {{ attr.docstring | escape }}
{%- endfor %}
{%- endif %}
