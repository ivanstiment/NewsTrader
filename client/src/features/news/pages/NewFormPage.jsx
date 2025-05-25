import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { newsApi } from "../news.api";

export function NewFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const { uuid } = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (uuid) {
      await newsApi.updateNew(uuid, data);
      toast.success("Noticia actualizada", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    } else {
      await newsApi.createNew(data);
      toast.success("Noticia creada", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    }
    navigate("/news");
  });

  useEffect(() => {
    async function loadNew() {
      if (!uuid) return;
      const {
        data: { title, news_type, link, provider_publish_time, publisher },
      } = await newsApi.getNew(uuid);
      setValue("title", title);
      setValue("news_type", news_type);
      setValue("link", link);
      setValue("provider_publish_time", provider_publish_time);
      setValue("publisher", publisher);
    }
    loadNew();
  }, [uuid, setValue]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Título"
          {...register("title", { required: true })}
        ></input>
        {errors.title && <span>El título de la noticia es obligatorio</span>}
        <input
          type="text"
          placeholder="Tipo de noticia"
          {...register("news_type", { required: true })}
        ></input>
        {errors.news_type && <span>El tipo de noticia es obligatorio</span>}
        <input
          type="text"
          placeholder="Enlace"
          {...register("link", { required: true })}
        ></input>
        {errors.link && <span>El enlace de la noticia es obligatorio</span>}
        <input
          type="text"
          placeholder="Fecha de publicación"
          {...register("provider_publish_time", { required: true })}
        ></input>
        {errors.provider_publish_time && (
          <span>La fecha de publicación de la noticia es obligatorio</span>
        )}
        <input
          type="text"
          placeholder="Proveedor"
          {...register("publisher", { required: true })}
        ></input>
        {errors.publisher && (
          <span>El proveedor de la noticia es obligatorio</span>
        )}
        <button>Guardar</button>
      </form>

      {uuid && (
        <button
          onClick={async () => {
            const accepted = window.confirm("¿Estás seguro?");
            if (accepted) {
              await newsApi.deleteNew(uuid);
              toast.success("Noticia eliminada", {
                position: "bottom-right",
                style: {
                  background: "#101010",
                  color: "#fff",
                },
              });
              navigate("/news");
            }
          }}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
